import { SecurityScanner } from '@maverick006/security-engine';
import { ScanInput, ScannerResult } from '@maverick006/types';
import * as fs from 'fs/promises';
import * as path from 'path';
import { parseZapOutput } from './parser';

export class ZapScanner implements SecurityScanner {
  public name = 'OWASP ZAP';
  public version = 'unknown';

  async scan(input: ScanInput): Promise<ScannerResult> {
    const startTime = new Date();
    
    try {
      // In a real environment, this adapter would execute the ZAP Docker container
      // or trigger a ZAP daemon via API to scan a target URL, then download the JSON report.
      // E.g., `docker run -v $(pwd):/zap/wrk/:rw -t owasp/zap2docker-stable zap-baseline.py -t <url> -J zap-report.json`
      // 
      // For the VibeGuard architecture, we assume the user/CI has generated the report 
      // and placed it in the repository root as 'zap-report.json' if a DAST scan was requested.
      
      const reportPath = path.join(input.repositoryPath, 'zap-report.json');
      
      let rawOutput = '';
      try {
        rawOutput = await fs.readFile(reportPath, 'utf8');
      } catch (err) {
        // If there's no report, we just return empty findings. DAST might not have been run.
        return {
          scanner: this.name,
          success: true,
          findings: [],
          rawOutput: 'No zap-report.json found',
          startTime,
          endTime: new Date()
        };
      }
      
      const findings = parseZapOutput(input.scanId, rawOutput);
      
      return {
        scanner: this.name,
        success: true,
        findings,
        rawOutput,
        startTime,
        endTime: new Date()
      };
    } catch (error: any) {
      return {
        scanner: this.name,
        success: false,
        findings: [],
        error: error.message || 'ZAP parser failed',
        rawOutput: '',
        startTime,
        endTime: new Date()
      };
    }
  }
}
