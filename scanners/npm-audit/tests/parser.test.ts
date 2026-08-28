import { parseNpmAuditOutput } from '../src/parser';
import * as fs from 'fs';
import * as path from 'path';
import { Severity, Confidence } from '@maverick006/types';

describe('npm audit Parser', () => {
  it('should parse npm audit json output correctly', () => {
    const fixturePath = path.join(__dirname, 'fixtures', 'npm-audit-output.json');
    const output = fs.readFileSync(fixturePath, 'utf8');
    
    const findings = parseNpmAuditOutput('test-scan-123', output);
    
    expect(findings.length).toBe(2);
    
    // Check first finding (express Path Traversal)
    const expressVuln = findings[0];
    expect(expressVuln.scanId).toBe('test-scan-123');
    expect(expressVuln.scanner).toBe('npm-audit');
    expect(expressVuln.title).toBe('Path Traversal in express');
    expect(expressVuln.severity).toBe(Severity.HIGH);
    expect(expressVuln.confidence).toBe(Confidence.HIGH);
    expect(expressVuln.cwe).toContain('CWE-22');
    expect(expressVuln.file).toBe('package.json');
    expect(expressVuln.category).toBe('dependency');
    expect(expressVuln.description).toContain('Fix: express@4.19.2');
    
    // Check second finding (lodash Prototype Pollution)
    const lodashVuln = findings[1];
    expect(lodashVuln.title).toBe('Prototype Pollution in lodash');
    expect(lodashVuln.severity).toBe(Severity.CRITICAL);
    expect(lodashVuln.cwe).toContain('CWE-1321');
    expect(lodashVuln.description).toContain('Fix: Available');
  });

  it('should handle malformed output gracefully', () => {
    expect(() => parseNpmAuditOutput('123', '{ invalid json }')).toThrow();
    
    const emptyFindings = parseNpmAuditOutput('123', '{"auditReportVersion": 2, "vulnerabilities": {}}');
    expect(emptyFindings.length).toBe(0);
  });
});
