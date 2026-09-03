import { NormalizedFinding, AIExplanation } from '@maverick006/types';
import OpenAI from 'openai';

export interface ExplanationOptions {
  apiKey?: string;
  model?: string;
  codeContext?: string;
}

/**
 * Generates contextual explanations for deterministic security findings using NVIDIA NIM.
 */
export class ContextualExplainer {
  private ai: OpenAI | null = null;
  private defaultModel = 'meta/llama-3.2-11b-vision-instruct'; // Fast, capable NIM model

  constructor(apiKey?: string) {
    const key = apiKey || process.env.NVIDIA_API_KEY;
    if (key) {
      this.ai = new OpenAI({
        apiKey: key,
        baseURL: 'https://integrate.api.nvidia.com/v1',
      });
    }
  }

  /**
   * Generates a contextual explanation and remediation strategy for a given finding.
   */
  async explainFinding(finding: NormalizedFinding, options: ExplanationOptions = {}): Promise<AIExplanation> {
    if (!this.ai) {
      // Fallback if no API key is provided
      return this.generateFallbackExplanation(finding);
    }

    try {
      const modelName = options.model || this.defaultModel;
      
      // MASK SECRETS BEFORE SENDING TO LLM
      const safeContext = this.maskSecrets(options.codeContext || '');
      const safeFinding = { ...finding, codeSnippet: this.maskSecrets(finding.codeSnippet || '') };
      
      const prompt = this.buildPrompt(safeFinding, safeContext);
      
      const completion = await this.ai.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2, // Low temp for more deterministic code fixes
        max_tokens: 1024,
      });

      const text = completion.choices[0]?.message?.content || "";

      return this.parseAIResponse(finding.scanId || 'unknown', text);
    } catch (error: any) {
      console.error('Failed to generate AI explanation:', error);
      return this.generateFallbackExplanation(finding, 'FAILED');
    }
  }

  /**
   * Prevents raw secrets from leaking to the LLM via simple regex masking.
   */
  private maskSecrets(text: string): string {
    if (!text) return text;
    let masked = text;
    // Mask AWS Keys
    masked = masked.replace(/AKIA[0-9A-Z]{16}/g, 'AKIA[MASKED_AWS_KEY]');
    // Mask Generic Secrets (e.g. secret="...", token='...')
    masked = masked.replace(/(password|secret|token|key)["'\s:=]+(["'])(?:(?!\2).)+(\2)/gi, '$1="[MASKED_SECRET]"');
    // Mask JWTs
    masked = masked.replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[MASKED_JWT]');
    return masked;
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
      let cleanText = text.trim();
      // Extract the first outer JSON object {...}
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }
      
      const parsed = JSON.parse(cleanText);

      return {
        id: `explain-${Date.now()}`,
        findingId,
        summary: parsed.summary || 'Explanation generated.',
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
        summary: 'AI Explanation Failed',
        details: 'The AI model failed to return a valid JSON response.',
        remediation: 'Please manually review the vulnerability details.',
        modelUsed: this.defaultModel,
        createdAt: new Date()
      };
    }
  }

  private generateFallbackExplanation(finding: NormalizedFinding, state: 'NOT_CONFIGURED' | 'FAILED' = 'NOT_CONFIGURED'): AIExplanation {
    return {
      id: `fallback-${Date.now()}`,
      findingId: finding.scanId,
      summary: state,
      details: finding.description,
      remediation: state === 'NOT_CONFIGURED' 
        ? 'NOT_CONFIGURED: Set NVIDIA_API_KEY to enable AI.' 
        : 'FAILED: AI provider request failed.',
      modelUsed: 'fallback',
      createdAt: new Date()
    };
  }
}
