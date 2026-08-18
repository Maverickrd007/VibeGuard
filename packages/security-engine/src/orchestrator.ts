import { NormalizedFinding, ScanInput, ScannerResult } from '@vibeguard/types';
import { SecurityScanner } from './scanner';

/**
 * Orchestrates the execution of multiple security scanners and aggregates/deduplicates their findings.
 */
export class Orchestrator {
  private scanners: SecurityScanner[] = [];

  constructor(scanners: SecurityScanner[]) {
    this.scanners = scanners;
  }

  /**
   * Executes all registered scanners against the given input.
   */
  async runScan(input: ScanInput): Promise<ScannerResult> {
    const startTime = new Date();
    
    // Execute all scanners concurrently
    const scanPromises = this.scanners.map(scanner => scanner.scan(input));
    const results = await Promise.allSettled(scanPromises);
    
    let allFindings: NormalizedFinding[] = [];
    const rawOutputs: Record<string, string> = {};
    
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const scannerName = this.scanners[i].name;

      if (result.status === 'fulfilled') {
        const data = result.value;
        allFindings = allFindings.concat(data.findings);
        if (data.rawOutput) {
          rawOutputs[scannerName] = data.rawOutput;
        }
      } else {
        // Log scanner failure safely (in production this would use a proper logger)
        console.error(`Scanner ${scannerName} failed:`, result.reason);
      }
    }

    const deduplicatedFindings = this.deduplicateFindings(allFindings);

    return {
      scanner: 'VibeGuard_Orchestrator',
      success: true,
      findings: deduplicatedFindings,
      rawOutput: JSON.stringify(rawOutputs), // Aggregate raw outputs
      startTime,
      endTime: new Date()
    };
  }

  /**
   * Deduplicates findings based on a fingerprint generated from ruleId, file, line, and column.
   */
  private deduplicateFindings(findings: NormalizedFinding[]): NormalizedFinding[] {
    const unique = new Map<string, NormalizedFinding>();
    
    for (const finding of findings) {
      // Create a unique fingerprint for the finding
      const fingerprint = `${finding.ruleId}-${finding.file}-${finding.line}-${finding.column}`;
      
      if (!unique.has(fingerprint)) {
        unique.set(fingerprint, finding);
      } else {
        // If it already exists, we might want to merge information, but for now we keep the first one
        // Optionally, if the new one has higher confidence, we could replace it.
      }
    }

    return Array.from(unique.values());
  }
}
