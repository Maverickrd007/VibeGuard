import { NormalizedFinding, Severity } from '@vibeguard/types';

export interface ScoreResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  metrics: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * Calculates a deterministic security score and grade based on the volume and severity of findings.
 * Weights: CRITICAL=100, HIGH=20, MEDIUM=5, LOW=1
 * 
 * Grade thresholds:
 * A: <= 10  (e.g., up to 2 mediums, or 10 lows)
 * B: <= 30  (e.g., 1 high, or several mediums)
 * C: <= 70  (e.g., 3 highs)
 * D: <= 150 (e.g., many highs, but no criticals. Or 1 critical and nothing else = 100, wait, 1 critical is auto F)
 * F: > 150 OR any CRITICAL finding.
 */
export function calculateScore(findings: NormalizedFinding[]): ScoreResult {
  let critical = 0;
  let high = 0;
  let medium = 0;
  let low = 0;
  let score = 0;

  for (const finding of findings) {
    switch (finding.severity) {
      case Severity.CRITICAL:
        critical++;
        score += 100;
        break;
      case Severity.HIGH:
        high++;
        score += 20;
        break;
      case Severity.MEDIUM:
        medium++;
        score += 5;
        break;
      case Severity.LOW:
      case Severity.INFO:
        low++;
        score += 1;
        break;
    }
  }

  let grade: ScoreResult['grade'] = 'A';

  if (critical > 0) {
    // A single CRITICAL vulnerability drops the grade to F immediately.
    grade = 'F';
  } else if (score > 150) {
    grade = 'F';
  } else if (score > 70) {
    grade = 'D';
  } else if (score > 30) {
    grade = 'C';
  } else if (score > 10) {
    grade = 'B';
  }

  return {
    score,
    grade,
    metrics: {
      critical,
      high,
      medium,
      low,
    }
  };
}
