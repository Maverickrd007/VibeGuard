import { parseCheckovOutput } from '../src/parser';
import * as fs from 'fs';
import * as path from 'path';
import { Severity, Confidence } from '@vibeguard/types';

describe('Checkov Parser', () => {
  it('should parse checkov json output correctly', () => {
    const fixturePath = path.join(__dirname, 'fixtures', 'checkov-output.json');
    const output = fs.readFileSync(fixturePath, 'utf8');
    
    const findings = parseCheckovOutput('test-scan-123', output);
    
    expect(findings.length).toBe(1);
    
    // Check first finding (S3 Public ACL)
    const s3Vuln = findings[0];
    expect(s3Vuln.scanId).toBe('test-scan-123');
    expect(s3Vuln.scanner).toBe('Checkov');
    expect(s3Vuln.title).toBe('Ensure S3 bucket has an ACL defined which allows public read access');
    expect(s3Vuln.severity).toBe(Severity.HIGH);
    expect(s3Vuln.confidence).toBe(Confidence.HIGH);
    expect(s3Vuln.cwe).toBe('CWE-16');
    expect(s3Vuln.file).toBe('/main.tf');
    expect(s3Vuln.line).toBe(10);
    expect(s3Vuln.category).toBe('iac');
    expect(s3Vuln.description).toContain('Resource: aws_s3_bucket.public_bucket');
  });

  it('should handle malformed output gracefully', () => {
    expect(() => parseCheckovOutput('123', '{ invalid json }')).toThrow();
    
    const emptyFindings = parseCheckovOutput('123', '{"results": {"failed_checks": []}}');
    expect(emptyFindings.length).toBe(0);
  });
});
