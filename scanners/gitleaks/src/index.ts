import { SecurityScanner } from '@vibeguard/security-engine';
import { ScanInput, ScannerResult } from '@vibeguard/types';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseGitleaksOutput } from './parser';
import * as path from 'path';

const execAsync = promisify(exec);

export class GitleaksScanner implements SecurityScanner {
  public name = 'Gitleaks';
  public version = 'unknown';

  async scan(input: ScanInput): Promise<ScannerResult> {
    const startTime = new Date();
    let rawOutput = '';
    
    try {
      const safePath = path.resolve(input.repositoryPath);
      
      // Gitleaks command: detect secrets in the directory.
      // --report-format json and --report-path to safely capture output
      // We will output to stdout using --report-path /dev/stdout on nix, 
      // but to be cross-platform, we can just let gitleaks write to a file or stdout.
      // `gitleaks detect --source <path> --no-git --report-format json --report-path -` writes to stdout.
      
      const { stdout } = await execAsync(`gitleaks detect --source "${safePath}" --no-git --report-format json --report-path -`, {
        timeout: 300000,
        maxBuffer: 1024 * 1024 * 50
      });
      
      rawOutput = stdout;
      const findings = parseGitleaksOutput(input.scanId, rawOutput);
      
      return {
        scanner: this.name,
        success: true,
        findings,
        rawOutput,
        startTime,
        endTime: new Date()
      };
    } catch (error: any) {
      // Gitleaks returns exit code 1 if secrets are present.
      if (error.stdout && (error.stdout.startsWith('[') || error.stdout.includes('"RuleID"'))) {
        try {
          rawOutput = error.stdout;
          const findings = parseGitleaksOutput(input.scanId, rawOutput);
          return {
            scanner: this.name,
            success: true,
            findings,
            rawOutput,
            startTime,
            endTime: new Date()
          };
        } catch (parseError) {
          // ignore parsing error if it wasn't actually JSON
        }
      }

      return {
        scanner: this.name,
        success: false,
        findings: [],
        error: error.message || 'Gitleaks execution failed',
        rawOutput: error.stdout || '',
        startTime,
        endTime: new Date()
      };
    }
  }
}
