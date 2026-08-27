import { NormalizedFinding, Severity, Confidence } from '@vibeguard/types';

export function parseGitleaksOutput(scanId: string, output: string): NormalizedFinding[] {
  try {
    if (!output || output.trim() === '') {
      return [];
    }

    const data = JSON.parse(output);
    const findings: NormalizedFinding[] = [];

    if (!Array.isArray(data)) {
      return findings; // Gitleaks returns an array of leaks
    }

    for (const leak of data) {
      // Gitleaks rule ID gives a hint of the secret type
      const ruleId = leak.RuleID || 'unknown-secret';
      
      // Secrets are almost always CRITICAL since they lead to instant compromise
      const severity = Severity.CRITICAL; 
      
      // Gitleaks relies on regex and entropy; confidence is generally HIGH
      const confidence = Confidence.HIGH;

      const finding: NormalizedFinding = {
        scanId,
        scanner: 'Gitleaks',
        scannerVersion: 'unknown', // Not easily extracted from the JSON output directly
        ruleId,
        title: leak.Description || `Exposed ${ruleId}`,
        description: `Secret leaked in commit ${leak.Commit || 'uncommitted'}. Match: ${leak.Match}`,
        severity,
        confidence,
        category: 'secret',
        file: leak.File,
        line: leak.StartLine,
        column: leak.StartColumn,
        codeSnippet: leak.Match,
        cwe: 'CWE-798', // Use of Hard-coded Credentials
        owasp: 'A07:2021', // Identification and Authentication Failures
      };

      findings.push(finding);
    }

    return findings;
  } catch (error) {
    throw new Error('Failed to parse Gitleaks JSON output');
  }
}
