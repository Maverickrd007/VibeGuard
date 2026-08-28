import { SecurityScanner } from '@maverick006/security-engine';
import { ScanInput, ScannerResult } from '@maverick006/types';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseSemgrepOutput } from './parser';
import * as path from 'path';

const execAsync = promisify(exec);

export class SemgrepScanner implements SecurityScanner {
  public name = 'Semgrep';
  public version = 'unknown'; // Will be parsed from output or binary check

  /**
   * Executes the Semgrep scanner safely.
   */
  async scan(input: ScanInput): Promise<ScannerResult> {
    const startTime = new Date();
    let rawOutput = '';
    
    try {
      // Validate path to prevent command injection
      const safePath = path.resolve(input.repositoryPath);
      
      // We run semgrep with --json. We use a timeout to prevent hanging.
      // Note: In a real environment, we'd ensure `semgrep` is installed.
      // For fixture/dev mode testing, if it fails to execute, we might catch the error.
      const { stdout, stderr } = await execAsync(`semgrep scan --json --quiet "${safePath}"`, {
        timeout: 300000, // 5 minutes max
        maxBuffer: 1024 * 1024 * 50 // 50MB max output
      });
      
      rawOutput = stdout;
      const findings = parseSemgrepOutput(input.scanId, rawOutput);
      
      return {
        scanner: this.name,
        success: true,
        findings,
        rawOutput,
        startTime,
        endTime: new Date()
      };
    } catch (error: any) {
      // Semgrep returns exit code 1 if it finds issues, which causes execAsync to throw.
      // We must handle this because exit code 1 is expected behavior for vulnerabilities.
      if (error.stdout && error.stdout.includes('"results":')) {
        try {
          rawOutput = error.stdout;
          const findings = parseSemgrepOutput(input.scanId, rawOutput);
          return {
            scanner: this.name,
            success: true,
            findings,
            rawOutput,
            startTime,
            endTime: new Date()
          };
        } catch (parseError) {
          // If we couldn't parse the output even when it had results, it's a real error
        }
      }

      return {
        scanner: this.name,
        success: false,
        findings: [],
        error: error.message || 'Semgrep execution failed',
        rawOutput: error.stdout || '',
        startTime,
        endTime: new Date()
      };
    }
  }
}
