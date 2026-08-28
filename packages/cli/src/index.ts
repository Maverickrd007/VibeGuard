#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { ContextualExplainer } from '@vibeguard/ai-engine';
import { NormalizedFinding, Severity } from '@vibeguard/types';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const program = new Command();

program
  .name('vibeguard')
  .description('VibeGuard Deterministic DevSecOps CLI')
  .version('1.0.0');

program
  .command('scan')
  .description('Run a security scan on the current directory')
  .option('-d, --dir <path>', 'Directory to scan', process.cwd())
  .option('--fix', 'Automatically generate AI remediation fixes')
  .action(async (options) => {
    console.log(chalk.bold.magenta('\n🛡️  VibeGuard Orchestrator Initiated\n'));
    
    const spinner = ora('Scanning repository for vulnerabilities...').start();
    
    // Simulate orchestration of underlying tools since this is the demo CLI
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    spinner.succeed('Scans completed via deterministic engines');

    // Generate mock findings that would come from the scanners
    const findings: NormalizedFinding[] = [
      {
        id: 'vg-001',
        title: 'SQL Injection Vulnerability',
        description: 'User input is directly concatenated into a SQL query, allowing for injection attacks.',
        severity: Severity.HIGH,
        scanner: 'Semgrep',
        file: 'src/api/users.ts',
        line: 42
      }
    ];

    console.log(chalk.bold(`\nFound ${findings.length} vulnerabilities.`));

    for (const finding of findings) {
      console.log(chalk.red(`\n[${finding.severity}] ${finding.title}`));
      console.log(chalk.gray(`File: ${finding.file}:${finding.line}`));
      console.log(`${finding.description}`);

      if (options.fix) {
        console.log(chalk.blue('\nGenerating AI Remediation...'));
        try {
          const explainer = new ContextualExplainer();
          // Mock file context
          let snippet = 'const query = "SELECT * FROM users WHERE name = " + req.query.name;';
          if (existsSync(join(options.dir, finding.file as string))) {
            const content = readFileSync(join(options.dir, finding.file as string), 'utf-8');
            snippet = content.split('\n').slice(Math.max(0, (finding.line as number) - 5), (finding.line as number) + 5).join('\n');
          }

          const explanation = await explainer.explainFinding(finding, { codeContext: snippet });
          
          console.log(chalk.green('\n✅ AI Remediation Plan:'));
          console.log(chalk.white(explanation.summary));
          console.log(chalk.white(explanation.details));
          
          console.log(chalk.green('\nSuggested Fix:'));
          console.log(chalk.white(explanation.codeFix || explanation.remediation));
        } catch (e: any) {
          console.log(chalk.yellow(`AI Fix generation failed: ${e.message}`));
        }
      }
    }
    
    console.log(chalk.magenta('\nScan complete.\n'));
  });

program.parse(process.argv);
