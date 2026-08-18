import { Orchestrator } from '../src/orchestrator';
import { SecurityScanner } from '../src/scanner';
import { ScanInput, ScannerResult, Severity, NormalizedFinding } from '@vibeguard/types';

class MockScanner implements SecurityScanner {
  public name: string;
  public version = '1.0.0';
  private findings: NormalizedFinding[];

  constructor(name: string, findings: NormalizedFinding[]) {
    this.name = name;
    this.findings = findings;
  }

  async scan(input: ScanInput): Promise<ScannerResult> {
    return {
      scanner: this.name,
      success: true,
      findings: this.findings,
      startTime: new Date(),
      endTime: new Date(),
    };
  }
}

describe('Orchestrator', () => {
  it('should aggregate findings from multiple scanners', async () => {
    const finding1: NormalizedFinding = {
      scanner: 'Mock1',
      title: 'Finding 1',
      description: 'Desc 1',
      severity: Severity.HIGH,
      ruleId: 'rule-1',
      file: 'test.js',
      line: 10,
    };
    
    const finding2: NormalizedFinding = {
      scanner: 'Mock2',
      title: 'Finding 2',
      description: 'Desc 2',
      severity: Severity.MEDIUM,
      ruleId: 'rule-2',
      file: 'test2.js',
      line: 20,
    };

    const scanner1 = new MockScanner('Mock1', [finding1]);
    const scanner2 = new MockScanner('Mock2', [finding2]);

    const orchestrator = new Orchestrator([scanner1, scanner2]);

    const result = await orchestrator.runScan({
      scanId: 'scan-1',
      repositoryPath: '/fake/path'
    });

    expect(result.findings.length).toBe(2);
    expect(result.findings).toEqual(expect.arrayContaining([finding1, finding2]));
  });

  it('should deduplicate findings with the same fingerprint', async () => {
    const finding1: NormalizedFinding = {
      scanner: 'Mock1',
      title: 'Finding 1',
      description: 'Desc 1',
      severity: Severity.HIGH,
      ruleId: 'rule-1',
      file: 'test.js',
      line: 10,
    };
    
    const finding2: NormalizedFinding = {
      scanner: 'Mock2',
      title: 'Finding 1 duplicate',
      description: 'Desc 1 duplicate',
      severity: Severity.HIGH,
      ruleId: 'rule-1', // Same rule
      file: 'test.js',  // Same file
      line: 10,         // Same line
    };

    const scanner1 = new MockScanner('Mock1', [finding1]);
    const scanner2 = new MockScanner('Mock2', [finding2]);

    const orchestrator = new Orchestrator([scanner1, scanner2]);

    const result = await orchestrator.runScan({
      scanId: 'scan-2',
      repositoryPath: '/fake/path'
    });

    expect(result.findings.length).toBe(1);
    expect(result.findings[0]).toEqual(finding1); // Should keep the first one
  });
});
