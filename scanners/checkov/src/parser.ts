import { NormalizedFinding, Severity, Confidence } from '@vibeguard/types';

export function parseCheckovOutput(scanId: string, output: string): NormalizedFinding[] {
  try {
    if (!output || output.trim() === '') {
      return [];
    }

    const data = JSON.parse(output);
    const findings: NormalizedFinding[] = [];

    // Checkov output can sometimes be an array if multiple frameworks are scanned
    const resultsArray = Array.isArray(data) ? data : [data];

    for (const report of resultsArray) {
      if (!report.results || !Array.isArray(report.results.failed_checks)) {
        continue;
      }

      for (const check of report.results.failed_checks) {
        
        let severity = Severity.INFO;
        if (check.severity === 'CRITICAL') severity = Severity.CRITICAL;
        else if (check.severity === 'HIGH') severity = Severity.HIGH;
        else if (check.severity === 'MEDIUM') severity = Severity.MEDIUM;
        else if (check.severity === 'LOW') severity = Severity.LOW;

        const finding: NormalizedFinding = {
          scanId,
          scanner: 'Checkov',
          scannerVersion: report.summary?.checkov_version || 'unknown',
          ruleId: check.check_id || 'checkov-misconf',
          title: check.check_name,
          description: `${check.description || check.check_name}. Resource: ${check.resource}`,
          severity,
          confidence: Confidence.HIGH, 
          category: 'iac',
          file: check.file_path,
          line: check.file_line_range && check.file_line_range.length > 0 ? check.file_line_range[0] : 1,
          cwe: 'CWE-16', // Configuration
          owasp: 'A05:2021', // Security Misconfiguration
        };
        findings.push(finding);
      }
    }

    return findings;
  } catch (error) {
    throw new Error('Failed to parse Checkov JSON output');
  }
}
