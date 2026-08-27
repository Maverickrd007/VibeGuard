import { NormalizedFinding, AIExplanation } from '@vibeguard/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ExplanationOptions {
  apiKey?: string;
  model?: string;
  codeContext?: string;
}

/**
 * Generates contextual explanations for deterministic security findings.
 */
export class ContextualExplainer {
  private genAI: GoogleGenerativeAI | null = null;
  private defaultModel = 'gemini-1.5-pro';

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (key) {
      this.genAI = new GoogleGenerativeAI(key);
    }
  }

  /**
   * Generates a contextual explanation and remediation strategy for a given finding.
   */
  async explainFinding(finding: NormalizedFinding, options: ExplanationOptions = {}): Promise<AIExplanation> {
    if (!this.genAI) {
      // Fallback if no API key is provided
      return this.generateFallbackExplanation(finding);
    }

    try {
      const modelName = options.model || this.defaultModel;
      const model = this.genAI.getGenerativeModel({ model: modelName });

      const prompt = this.buildPrompt(finding, options.codeContext);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(finding.scanId || 'unknown', text);
    } catch (error: any) {
      console.error('Failed to generate AI explanation:', error);
      return this.generateFallbackExplanation(finding);
    }
  }

  private buildPrompt(finding: NormalizedFinding, codeContext?: string): string {
    return `
You are VibeGuard, a strict, deterministic DevSecOps assistant. 
A deterministic security scanner has found the following vulnerability. 
Do not guess if it's a false positive, assume the scanner is correct.
Your job is to explain the vulnerability clearly to a developer and provide a safe remediation snippet.

SCANNER FINDING:
Title: ${finding.title}
Severity: ${finding.severity}
Scanner: ${finding.scanner}
File: ${finding.file}
Line: ${finding.line}
Rule: ${finding.ruleId}
Description: ${finding.description}
CWE: ${finding.cwe || 'Unknown'}
OWASP: ${finding.owasp || 'Unknown'}

${codeContext ? `CODE CONTEXT:\n${codeContext}` : ''}
${finding.codeSnippet ? `SNIPPET:\n${finding.codeSnippet}` : ''}

Format your response exactly as the following JSON. Do not include markdown blocks around the JSON, just output raw JSON:
{
  "summary": "A 1-2 sentence summary of what the issue is.",
  "details": "A detailed explanation of how this vulnerability works and why it's dangerous.",
  "remediation": "A step-by-step guide to fixing the issue.",
  "codeFix": "The exact code snippet to replace the vulnerable code. (Optional, if applicable)"
}
`;
  }

  private parseAIResponse(findingId: string, text: string): AIExplanation {
    try {
      // Strip potential markdown code blocks if the AI disobeyed instructions
      const cleanText = text.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      const parsed = JSON.parse(cleanText);

      return {
        id: `explain-${Date.now()}`,
        findingId,
        summary: parsed.summary || 'Explanation generation failed.',
        details: parsed.details || '',
        remediation: parsed.remediation || '',
        codeFix: parsed.codeFix,
        modelUsed: this.defaultModel,
        createdAt: new Date()
      };
    } catch (e) {
      return {
        id: `explain-${Date.now()}`,
        findingId,
        summary: 'Failed to parse AI response.',
        details: 'The AI provided an explanation, but it was not in the expected format.',
        remediation: text, // dumping raw text into remediation as fallback
        modelUsed: this.defaultModel,
        createdAt: new Date()
      };
    }
  }

  private generateFallbackExplanation(finding: NormalizedFinding): AIExplanation {
    return {
      id: `fallback-${Date.now()}`,
      findingId: finding.scanId,
      summary: `Automated summary for ${finding.title}`,
      details: finding.description,
      remediation: 'Please consult the scanner documentation for remediation steps.',
      modelUsed: 'fallback',
      createdAt: new Date()
    };
  }
}
