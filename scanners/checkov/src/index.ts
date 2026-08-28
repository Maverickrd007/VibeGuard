import { SecurityScanner } from '@maverick006/security-engine';
import { ScanInput, ScannerResult } from '@maverick006/types';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseCheckovOutput } from './parser';
import * as path from 'path';

const execAsync = promisify(exec);

export class CheckovScanner implements SecurityScanner {
  public name = 'Checkov';
  public version = 'unknown';

  async scan(input: ScanInput): Promise<ScannerResult> {
    const startTime = new Date();
    let rawOutput = '';
    
    try {
      const safePath = path.resolve(input.repositoryPath);
      
      // We expect checkov to be installed in the environment (e.g. via pip install checkov)
      const { stdout } = await execAsync(`checkov -d "${safePath}" -o json`, {
        timeout: 300000,
        maxBuffer: 1024 * 1024 * 50
      });
      
      rawOutput = stdout;
      const findings = parseCheckovOutput(input.scanId, rawOutput);
      
      return {
        scanner: this.name,
        success: true,
        findings,
        rawOutput,
        startTime,
        endTime: new Date()
      };
    } catch (error: any) {
      // Checkov returns exit code > 0 if failures are found
      if (error.stdout && error.stdout.includes('"failed_checks"')) {
        try {
          rawOutput = error.stdout;
          const findings = parseCheckovOutput(input.scanId, rawOutput);
          return {
            scanner: this.name,
            success: true,
            findings,
            rawOutput,
            startTime,
            endTime: new Date()
          };
        } catch (parseError) {
          // ignore parsing error
        }
      }

      return {
        scanner: this.name,
        success: false,
        findings: [],
        error: error.message || 'Checkov execution failed',
        rawOutput: error.stdout || '',
        startTime,
        endTime: new Date()
      };
    }
  }
}
