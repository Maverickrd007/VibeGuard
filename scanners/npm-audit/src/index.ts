import { SecurityScanner } from '@maverick006/security-engine';
import { ScanInput, ScannerResult } from '@maverick006/types';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseNpmAuditOutput } from './parser';
import * as path from 'path';

const execAsync = promisify(exec);

export class NpmAuditScanner implements SecurityScanner {
  public name = 'npm-audit';
  public version = 'unknown';

  async scan(input: ScanInput): Promise<ScannerResult> {
    const startTime = new Date();
    let rawOutput = '';
    
    try {
      const safePath = path.resolve(input.repositoryPath);
      
      // npm audit --json outputs audit data. We run it in the repository path.
      // Note: this assumes package.json exists. If it doesn't, npm audit will fail, which we can catch.
      const { stdout } = await execAsync(`npm audit --json --prefix "${safePath}"`, {
        timeout: 300000,
        maxBuffer: 1024 * 1024 * 50
      });
      
      rawOutput = stdout;
      const findings = parseNpmAuditOutput(input.scanId, rawOutput);
      
      return {
        scanner: this.name,
        success: true,
        findings,
        rawOutput,
        startTime,
        endTime: new Date()
      };
    } catch (error: any) {
      // npm audit returns exit code > 0 if vulnerabilities are found
      if (error.stdout && error.stdout.includes('"auditReportVersion":')) {
        try {
          rawOutput = error.stdout;
          const findings = parseNpmAuditOutput(input.scanId, rawOutput);
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
        error: error.message || 'npm audit execution failed',
        rawOutput: error.stdout || '',
        startTime,
        endTime: new Date()
      };
    }
  }
}
