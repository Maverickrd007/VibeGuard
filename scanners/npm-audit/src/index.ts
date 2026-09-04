import { SecurityScanner } from '@maverick006/security-engine';
import { ScanInput, ScannerResult } from '@maverick006/types';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { parseNpmAuditOutput } from './parser';
import * as path from 'path';

const execFileAsync = promisify(execFile);

export class NpmAuditScanner implements SecurityScanner {
  public name = 'npm-audit';
  public version = 'unknown';

  async scan(input: ScanInput): Promise<ScannerResult> {
    const startTime = new Date();
    let rawOutput = '';
    
    try {
      const safePath = path.resolve(input.repositoryPath);
      
      // Use execFile to prevent command injection
      const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      
      const fs = require('fs');
      const args = ['audit', '--json', '--prefix', safePath, '--omit=dev'];
      
      if (fs.existsSync(path.join(safePath, 'package-lock.json'))) {
        args.push('--package-lock-only');
      }

      const { stdout } = await execFileAsync(npmCmd, args, {
        timeout: 60000, // 1 minute max
        maxBuffer: 1024 * 1024 * 50,
        shell: process.platform === 'win32'
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
