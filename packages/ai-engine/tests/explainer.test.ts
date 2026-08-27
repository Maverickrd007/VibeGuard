import { ContextualExplainer } from '../src/explainer';
import { NormalizedFinding, Severity, Confidence } from '@vibeguard/types';

// Mock the GoogleGenerativeAI module
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: () => JSON.stringify({
                summary: "This is a mock summary of SQL Injection.",
                details: "Mock details about how SQLi works.",
                remediation: "Use parameterized queries.",
                codeFix: "SELECT * FROM users WHERE id = ?"
              })
            }
          })
        })
      };
    })
  };
});

describe('ContextualExplainer', () => {
  const mockFinding: NormalizedFinding = {
    scanId: 'scan-1',
    scanner: 'test-scanner',
    scannerVersion: '1.0',
    ruleId: 'sqli',
    title: 'SQL Injection',
    description: 'Found SQLi',
    severity: Severity.HIGH,
    confidence: Confidence.HIGH,
    category: 'sast',
    file: 'db.ts',
    line: 10
  };

  it('should return a fallback explanation if no API key is provided', async () => {
    // Delete env var if it exists for test
    const oldEnv = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const explainer = new ContextualExplainer();
    const explanation = await explainer.explainFinding(mockFinding);

    expect(explanation.modelUsed).toBe('fallback');
    expect(explanation.summary).toContain('Automated summary');

    // Restore env var
    process.env.GEMINI_API_KEY = oldEnv;
  });

  it('should call the generative AI and parse the response correctly', async () => {
    const explainer = new ContextualExplainer('fake-api-key');
    const explanation = await explainer.explainFinding(mockFinding, {
      codeContext: 'const query = "SELECT * FROM users WHERE id = " + req.query.id;'
    });

    expect(explanation.modelUsed).toBe('gemini-1.5-pro');
    expect(explanation.summary).toBe('This is a mock summary of SQL Injection.');
    expect(explanation.details).toBe('Mock details about how SQLi works.');
    expect(explanation.remediation).toBe('Use parameterized queries.');
    expect(explanation.codeFix).toBe('SELECT * FROM users WHERE id = ?');
  });
});
