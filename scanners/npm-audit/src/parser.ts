import { NormalizedFinding, Severity, Confidence } from '@maverick006/types';

export function parseNpmAuditOutput(scanId: string, output: string): NormalizedFinding[] {
  try {
    const data = JSON.parse(output);
    const findings: NormalizedFinding[] = [];

    // npm audit JSON output format: version 2
    if (data.auditReportVersion !== 2 || !data.vulnerabilities) {
      return findings;
    }

    for (const [pkgName, vulnData] of Object.entries<any>(data.vulnerabilities)) {
      
      const viaArray = Array.isArray(vulnData.via) ? vulnData.via : [];
      
      // Some 'via' entries are just strings (referencing other packages), 
      // we look for objects that contain actual vulnerability details.
      for (const via of viaArray) {
        if (typeof via === 'object' && via.title) {
          
          let severity = Severity.INFO;
          if (via.severity === 'critical') severity = Severity.CRITICAL;
          else if (via.severity === 'high') severity = Severity.HIGH;
          else if (via.severity === 'moderate') severity = Severity.MEDIUM;
          else if (via.severity === 'low') severity = Severity.LOW;

          const finding: NormalizedFinding = {
            scanId,
            scanner: 'npm-audit',
            scannerVersion: 'v2', // refers to report version
            ruleId: via.url || `npm-audit-${pkgName}`,
            title: via.title,
            description: `Dependency vulnerability in ${pkgName}. Range: ${via.range}. Fix: ${
              vulnData.fixAvailable ? (typeof vulnData.fixAvailable === 'object' ? vulnData.fixAvailable.name + '@' + vulnData.fixAvailable.version : 'Available') : 'None'
            }`,
            severity,
            confidence: Confidence.HIGH, // SCA scans matching a CVE have high confidence
            category: 'dependency',
            file: 'package.json', // Best guess for location
            line: 1, // Doesn't map well to line numbers
            cwe: Array.isArray(via.cwe) ? via.cwe.join(', ') : via.cwe,
            owasp: 'A06:2021', // Vulnerable and Outdated Components
          };

          findings.push(finding);
        }
      }
    }

    return findings;
  } catch (error) {
    throw new Error('Failed to parse npm audit JSON output');
  }
}
