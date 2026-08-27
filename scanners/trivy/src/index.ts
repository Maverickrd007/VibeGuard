import { SecurityScanner } from '@vibeguard/security-engine';
import { ScanInput, ScannerResult } from '@vibeguard/types';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseTrivyOutput } from './parser';
import * as path from 'path';

const execAsync = promisify(exec);

export class TrivyScanner implements SecurityScanner {
  public name = 'Trivy';
  public version = 'unknown';

  async scan(input: ScanInput): Promise<ScannerResult> {
    const startTime = new Date();
    let rawOutput = '';
    
    try {
      const safePath = path.resolve(input.repositoryPath);
      
      // Trivy fs scans the filesystem for both dependencies, OS packages (if roots are present), and IaC.
      // --security-checks vuln,config,secret
      const { stdout } = await execAsync(`trivy fs --format json "${safePath}"`, {
        timeout: 300000,
        maxBuffer: 1024 * 1024 * 50
      });
      
      rawOutput = stdout;
      const findings = parseTrivyOutput(input.scanId, rawOutput);
      
      return {
        scanner: this.name,
        success: true,
        findings,
        rawOutput,
        startTime,
        endTime: new Date()
      };
    } catch (error: any) {
      // Trivy might return a non-zero exit code if vulnerabilities are found or on failure.
      if (error.stdout && error.stdout.includes('"SchemaVersion":')) {
        try {
          rawOutput = error.stdout;
          const findings = parseTrivyOutput(input.scanId, rawOutput);
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
        error: error.message || 'Trivy execution failed',
        rawOutput: error.stdout || '',
        startTime,
        endTime: new Date()
      };
    }
  }
}
