import { NormalizedFinding, Severity, Confidence } from '@maverick006/types';

export function parseProwlerOutput(scanId: string, output: string): NormalizedFinding[] {
  try {
    if (!output || output.trim() === '') {
      return [];
    }

    const data = JSON.parse(output);
    const findings: NormalizedFinding[] = [];

    const resultsArray = Array.isArray(data) ? data : [data];

    for (const check of resultsArray) {
      if (check.Status !== 'FAIL') {
        continue;
      }

      let severity = Severity.INFO;
      const originalSeverity = (check.Severity || '').toLowerCase();
      if (originalSeverity === 'critical') severity = Severity.CRITICAL;
      else if (originalSeverity === 'high') severity = Severity.HIGH;
      else if (originalSeverity === 'medium') severity = Severity.MEDIUM;
      else if (originalSeverity === 'low') severity = Severity.LOW;

      const finding: NormalizedFinding = {
        scanId,
        scanner: 'Prowler',
        scannerVersion: 'unknown',
        ruleId: check.CheckID || 'aws-misconf',
        title: check.CheckTitle || 'AWS Security Misconfiguration',
        description: `${check.StatusExtended || check.Description}. Risk: ${check.Risk || 'Unknown'}. Recommendation: ${check.Remediation?.Recommendation?.Text || 'None'}.`,
        severity,
        confidence: Confidence.HIGH, 
        category: 'cloud',
        file: check.ResourceArn || check.ResourceId || 'AWS Account',
        line: 1,
        cwe: 'CWE-16', // Configuration
        owasp: 'A05:2021', // Security Misconfiguration
      };
      findings.push(finding);
    }

    return findings;
  } catch (error) {
    throw new Error('Failed to parse Prowler JSON output');
  }
}
