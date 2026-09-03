/**
 * Defines the normalized severity levels for security findings.
 */
export enum Severity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO'
}

/**
 * Defines the confidence level of the scanner finding the vulnerability.
 */
export enum Confidence {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

/**
 * Defines the status of a finding in the VibeGuard system.
 */
export enum FindingStatus {
  OPEN = 'OPEN',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  FIXED = 'FIXED',
  FALSE_POSITIVE = 'FALSE_POSITIVE'
}

/**
 * The core normalized finding model.
 * Every vulnerability finding should be converted into this structure.
 */
export interface NormalizedFinding {
  id?: string;
  scanId?: string;
  scanner: string;
  scannerVersion?: string;
  ruleId?: string;
  title: string;
  description: string;
  severity: Severity;
  confidence?: Confidence;
  category?: string;
  owasp?: string;
  cwe?: string;
  file?: string;
  line?: number;
  column?: number;
  codeSnippet?: string;
  fingerprint?: string;
  package?: string;
  packageVersion?: string;
  fixedVersion?: string;
  container?: string;
  image?: string;
  remediation?: string;
  references?: string[];
  status?: FindingStatus;
  createdAt?: Date;
}

/**
 * Input configuration provided to a scanner when starting a scan.
 */
export interface ScanInput {
  scanId: string;
  repositoryPath: string;
  options?: Record<string, any>;
}

/**
 * The standard output format expected from any SecurityScanner adapter.
 */
export interface ScannerResult {
  scanner: string;
  success: boolean;
  findings: NormalizedFinding[];
  rawOutput?: string;
  error?: string;
  startTime: Date;
  endTime: Date;
}

export interface AIExplanation {
  id: string;
  findingId?: string;
  summary: string;
  details: string;
  remediation: string;
  codeFix?: string;
  modelUsed: string;
  createdAt: Date;
}

