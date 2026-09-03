#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { ContextualExplainer } from '@maverick006/ai-engine';
import { NormalizedFinding, Severity } from '@maverick006/types';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { renderDashboard, calculateScore, getGitInfo } from './formatter';

const program = new Command();

program
  .name('vibeguard')
  .description('AI-Powered DevSecOps Orchestrator CLI')
  .version('1.0.2');

program
  .command('scan [path]')
  .description('Run a security scan on the current directory or target path')
  .option('-d, --dir <path>', 'Directory to scan', process.cwd())
  .option('--fix', 'Automatically generate AI remediation fixes and interactive diff')
  .option('--demo', 'Showcase the complete security dashboard with sample findings')
  .action(async (targetPath, options) => {
    const scanDir = targetPath || options.dir || process.cwd();
    const startTime = Date.now();

    const spinner = ora({
      text: chalk.hex('#00E5FF')('Scanning repository for vulnerabilities (SAST, SCA, Secrets, IaC)...'),
      spinner: 'dots'
    }).start();

    let findings: NormalizedFinding[] = [];

    try {
      // Initialize the security orchestrator and scanners
      const { Orchestrator } = require('@maverick006/security-engine');
      const { NpmAuditScanner } = require('@maverick006/scanner-npm-audit');
      const { TrivyScanner } = require('@maverick006/scanner-trivy');
      const { SemgrepScanner } = require('@maverick006/scanner-semgrep');
      const { GitleaksScanner } = require('@maverick006/scanner-gitleaks');
      const { CheckovScanner } = require('@maverick006/scanner-checkov');
      const { ZapScanner } = require('@maverick006/scanner-zap');

      const orchestrator = new Orchestrator([
        new NpmAuditScanner(),
        new TrivyScanner(),
        new SemgrepScanner(),
        new GitleaksScanner(),
        new CheckovScanner(),
        new ZapScanner()
      ]);

      const scanResult = await orchestrator.runScan({
        scanId: `scan-${Date.now()}`,
        repositoryUrl: 'local',
        repositoryPath: scanDir,
        branch: 'main'
      });

      findings = scanResult.findings || [];
    } catch (err) {
      // Fallback gracefully if scanner encounters environmental differences
      console.error(chalk.red('Orchestrator failed to run scans.'), err);
    }

    spinner.stop();

    const elapsedMs = Date.now() - startTime;
    const duration = elapsedMs > 60000 
      ? `${Math.floor(elapsedMs / 60000)}m ${Math.floor((elapsedMs % 60000) / 1000)}s`
      : `${(elapsedMs / 1000).toFixed(1)}s`;

    const stats = calculateScore(findings);
    const gitInfo = getGitInfo(scanDir);

    let remediationData: any = undefined;

    // Generate AI Remediation
    if (findings.length > 0 && (options.fix || true)) {
      try {
        const explainer = new ContextualExplainer();
        const primaryFinding = findings[0];

        let snippet = primaryFinding.codeSnippet || '';
        if (primaryFinding.file && existsSync(join(scanDir, primaryFinding.file))) {
          const content = readFileSync(join(scanDir, primaryFinding.file), 'utf-8');
          const lines = content.split('\n');
          const targetLine = primaryFinding.line || 1;
          snippet = lines.slice(Math.max(0, targetLine - 3), targetLine + 3).join('\n');
        }

        const explanation = await explainer.explainFinding(primaryFinding, { codeContext: snippet });

        remediationData = {
          findingId: primaryFinding.id,
          issue: explanation.summary,
          impact: explanation.details || 'Potential security impact based on context.',
          recommendation: explanation.remediation,
          diffSnippet: explanation.codeFix || '',
          confidence: 90
        };
      } catch (e: any) {
        console.error(chalk.yellow('AI Remediation generation failed.'), e);
      }
    }

    // Render the beautiful cyber dashboard
    renderDashboard({
      findings,
      stats,
      gitInfo,
      duration,
      remediation: remediationData
    });

    // Sync with Web Dashboard
    const syncSpinner = ora({
      text: chalk.dim('Syncing results to VibeGuard Dashboard...'),
      spinner: 'dots'
    }).start();

    try {
      const API_URL = process.env.VIBEGUARD_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/scans/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repositoryName: gitInfo.name || 'Local Project',
          repositoryUrl: gitInfo.name || 'local',
          numericScore: stats.score,
          score: stats.riskLevel,
          findings: findings
        })
      });
      
      if (response.ok) {
        syncSpinner.succeed(chalk.dim('Results synced to dashboard.'));
      } else {
        syncSpinner.fail(chalk.dim('Failed to sync results to dashboard.'));
      }
    } catch (e) {
      syncSpinner.warn(chalk.dim('Dashboard API unreachable. Skipping sync.'));
    }
  });

program.parse(process.argv);

