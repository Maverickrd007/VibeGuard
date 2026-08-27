import { parseZapOutput } from '../src/parser';
import * as fs from 'fs';
import * as path from 'path';
import { Severity, Confidence } from '@vibeguard/types';

describe('ZAP Parser', () => {
  it('should parse zap json output correctly', () => {
    const fixturePath = path.join(__dirname, 'fixtures', 'zap-output.json');
    const output = fs.readFileSync(fixturePath, 'utf8');
    
    const findings = parseZapOutput('test-scan-123', output);
    
    expect(findings.length).toBe(2);
    
    // Check first finding (SQLi)
    const sqli = findings[0];
    expect(sqli.scanId).toBe('test-scan-123');
    expect(sqli.scanner).toBe('OWASP ZAP');
    expect(sqli.title).toBe('SQL Injection');
    expect(sqli.severity).toBe(Severity.HIGH);
    expect(sqli.confidence).toBe(Confidence.MEDIUM); // riskdesc High (Medium confidence) -> confidence: "2"
    expect(sqli.cwe).toBe('CWE-89');
    expect(sqli.file).toBe('http://localhost:8080/api/users');
    expect(sqli.category).toBe('dast');
    expect(sqli.codeSnippet).toContain('Attack: 1\' OR \'1\'=\'1');
    expect(sqli.description).toContain('Use parameterized queries');
    expect(sqli.description).not.toContain('<p>'); // should strip HTML
    
    // Check second finding (CSRF)
    const csrf = findings[1];
    expect(csrf.title).toBe('Anti-CSRF Tokens Check');
    expect(csrf.severity).toBe(Severity.MEDIUM); // riskcode "2"
    expect(csrf.confidence).toBe(Confidence.HIGH); // confidence "3"
    expect(csrf.file).toBe('http://localhost:8080/api/profile/update');
  });

  it('should handle malformed output gracefully', () => {
    expect(() => parseZapOutput('123', '{ invalid json }')).toThrow();
    
    const emptyFindings = parseZapOutput('123', '{"@version": "2.13.0", "site": []}');
    expect(emptyFindings.length).toBe(0);
  });
});
