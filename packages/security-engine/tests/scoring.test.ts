import { calculateScore } from '../src/scoring';
import { NormalizedFinding, Severity } from '@vibeguard/types';

describe('Deterministic Scoring Engine', () => {
  
  const createFinding = (severity: Severity): NormalizedFinding => ({
    scanner: 'test',
    ruleId: 'test-rule',
    title: 'test finding',
    description: 'test desc',
    severity,
    file: 'test.ts',
    line: 1
  });

  it('should return grade A for perfect score (0 findings)', () => {
    const result = calculateScore([]);
    expect(result.score).toBe(0);
    expect(result.grade).toBe('A');
  });

  it('should return grade A for score <= 10 (e.g. 2 mediums)', () => {
    const findings = [
      createFinding(Severity.MEDIUM), // 5
      createFinding(Severity.MEDIUM), // 5
    ];
    const result = calculateScore(findings);
    expect(result.score).toBe(10);
    expect(result.grade).toBe('A');
  });

  it('should return grade B for score <= 30 (e.g. 1 high, 2 lows)', () => {
    const findings = [
      createFinding(Severity.HIGH), // 20
      createFinding(Severity.LOW),  // 1
      createFinding(Severity.LOW),  // 1
    ];
    const result = calculateScore(findings);
    expect(result.score).toBe(22);
    expect(result.grade).toBe('B');
  });

  it('should immediately return grade F if any CRITICAL finding exists', () => {
    const findings = [
      createFinding(Severity.CRITICAL), // 100
      createFinding(Severity.LOW),      // 1
    ];
    const result = calculateScore(findings);
    // Score is 101, which is normally D, but CRITICAL forces F
    expect(result.score).toBe(101);
    expect(result.grade).toBe('F');
  });

  it('should return grade F if score > 150 without criticals', () => {
    // 8 HIGHs = 160 score
    const findings = Array(8).fill(createFinding(Severity.HIGH));
    const result = calculateScore(findings);
    expect(result.score).toBe(160);
    expect(result.grade).toBe('F');
  });

});
