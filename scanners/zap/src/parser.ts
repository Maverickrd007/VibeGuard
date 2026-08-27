import { NormalizedFinding, Severity, Confidence } from '@vibeguard/types';

export function parseZapOutput(scanId: string, output: string): NormalizedFinding[] {
  try {
    if (!output || output.trim() === '') {
      return [];
    }

    const data = JSON.parse(output);
    const findings: NormalizedFinding[] = [];

    if (!data.site || !Array.isArray(data.site)) {
      return findings;
    }

    for (const site of data.site) {
      if (!Array.isArray(site.alerts)) continue;

      for (const alert of site.alerts) {
        
        let severity = Severity.INFO;
        // riskcode: 3=High, 2=Medium, 1=Low, 0=Informational
        if (alert.riskcode === '3') severity = Severity.HIGH;
        else if (alert.riskcode === '2') severity = Severity.MEDIUM;
        else if (alert.riskcode === '1') severity = Severity.LOW;

        let confidence = Confidence.MEDIUM;
        // confidence: 3=High, 2=Medium, 1=Low, 0=FalsePositive
        if (alert.confidence === '3') confidence = Confidence.HIGH;
        else if (alert.confidence === '1') confidence = Confidence.LOW;

        // An alert can have multiple instances (endpoints where it was found)
        const instances = Array.isArray(alert.instances) ? alert.instances : [];

        for (const instance of instances) {
          
          // ZAP sometimes includes HTML tags in descriptions. We can do a rudimentary strip.
          const cleanDesc = (alert.desc || '').replace(/<[^>]*>?/gm, '');
          const cleanSolution = (alert.solution || '').replace(/<[^>]*>?/gm, '');

          const finding: NormalizedFinding = {
            scanId,
            scanner: 'OWASP ZAP',
            scannerVersion: data['@version'] || 'unknown',
            ruleId: alert.pluginid || 'zap-alert',
            title: alert.name || alert.alert,
            description: `${cleanDesc} Solution: ${cleanSolution}`,
            severity,
            confidence,
            category: 'dast',
            file: instance.uri || site['@name'],
            line: 1, // DAST doesn't map to lines of code
            codeSnippet: `Method: ${instance.method}. Param: ${instance.param}. Attack: ${instance.attack}`,
            cwe: alert.cweid ? `CWE-${alert.cweid}` : undefined,
          };
          findings.push(finding);
        }
      }
    }

    return findings;
  } catch (error) {
    throw new Error('Failed to parse ZAP JSON output');
  }
}
