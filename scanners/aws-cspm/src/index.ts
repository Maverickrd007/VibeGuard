import { SecurityScanner } from '@vibeguard/security-engine';
import { ScanInput, ScannerResult } from '@vibeguard/types';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseProwlerOutput } from './parser';

const execAsync = promisify(exec);

export class AwsCspmScanner implements SecurityScanner {
  public name = 'Prowler';
  public version = 'unknown';

  async scan(input: ScanInput): Promise<ScannerResult> {
    const startTime = new Date();
    let rawOutput = '';
    
    try {
      // In a real environment, Prowler scans the AWS account using credentials
      // configured in the environment (e.g., AWS_ACCESS_KEY_ID).
      // Here we assume `prowler aws -M json` outputs the file to `output/`.
      // For this adapter, we will simulate reading a generated report if it exists,
      // or we can run the CLI. We'll run the CLI command.
      
      const { stdout } = await execAsync(`prowler aws -M json --quiet`, {
        timeout: 300000,
        maxBuffer: 1024 * 1024 * 50
      });
      
      rawOutput = stdout;
      // In reality Prowler writes to a file, but for architecture simulation we assume stdout or standard file.
      const findings = parseProwlerOutput(input.scanId, rawOutput);
      
      return {
        scanner: this.name,
        success: true,
        findings,
        rawOutput,
        startTime,
        endTime: new Date()
      };
    } catch (error: any) {
      // CLI might fail or we parse from error.stdout
      if (error.stdout && error.stdout.includes('"CheckID"')) {
        try {
          rawOutput = error.stdout;
          const findings = parseProwlerOutput(input.scanId, rawOutput);
          return {
            scanner: this.name,
            success: true,
            findings,
            rawOutput,
            startTime,
            endTime: new Date()
          };
        } catch (parseError) {
          // ignore
        }
      }

      return {
        scanner: this.name,
        success: false,
        findings: [],
        error: error.message || 'Prowler execution failed',
        rawOutput: error.stdout || '',
        startTime,
        endTime: new Date()
      };
    }
  }
}
