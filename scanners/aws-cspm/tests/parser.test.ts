import { parseProwlerOutput } from '../src/parser';
import * as fs from 'fs';
import * as path from 'path';
import { Severity, Confidence } from '@maverick006/types';

describe('Prowler Parser', () => {
  it('should parse prowler json output correctly', () => {
    const fixturePath = path.join(__dirname, 'fixtures', 'prowler-output.json');
    const output = fs.readFileSync(fixturePath, 'utf8');
    
    const findings = parseProwlerOutput('test-scan-123', output);
    
    expect(findings.length).toBe(1);
    
    // Check first finding (IAM MFA)
    const iamVuln = findings[0];
    expect(iamVuln.scanId).toBe('test-scan-123');
    expect(iamVuln.scanner).toBe('Prowler');
    expect(iamVuln.title).toBe('Ensure MFA is enabled for all IAM users that have a console password');
    expect(iamVuln.severity).toBe(Severity.HIGH);
    expect(iamVuln.confidence).toBe(Confidence.HIGH);
    expect(iamVuln.cwe).toBe('CWE-16');
    expect(iamVuln.file).toBe('arn:aws:iam::123456789012:user/test-user');
    expect(iamVuln.category).toBe('cloud');
    expect(iamVuln.description).toContain('User test-user has Console Password enabled but MFA disabled.');
    expect(iamVuln.description).toContain('Risk: Without MFA');
  });

  it('should handle malformed output gracefully', () => {
    expect(() => parseProwlerOutput('123', '{ invalid json }')).toThrow();
    
    const emptyFindings = parseProwlerOutput('123', '[]');
    expect(emptyFindings.length).toBe(0);
  });
});
