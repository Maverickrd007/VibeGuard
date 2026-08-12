# VibeGuard

**Security for the AI-Built Software Era**

VibeGuard is a professional DevSecOps security platform designed to identify, analyze, prioritize, explain, and help remediate security vulnerabilities in applications created using AI coding assistants and "vibe coding" workflows.

## Mission
To bridge the gap between rapidly generated AI code and the need for deterministic, robust security analysis. VibeGuard provides an extensible framework that runs deterministic security scanners and utilizes AI contextually to explain and assist in remediation—without treating AI as the authoritative source of truth.

## Features (Planned)
- Static Application Security Testing (SAST)
- Secret Detection
- Dependency Vulnerability Scanning
- Container Image Scanning
- Infrastructure as Code (IaC) Scanning
- Deterministic Security Scoring
- CI/CD Integration & Security Gates
- Vibe-Code Research Mode for comparative analysis

## Architecture
VibeGuard is structured as a monorepo containing:
- `apps/`: Web frontend and API backend
- `packages/`: Shared types, core security engine, and configuration
- `scanners/`: Pluggable adapters for deterministic scanners (e.g., Semgrep, Gitleaks, Trivy)
- `infrastructure/`: Docker and Terraform deployments

## Getting Started
(Documentation in progress as the project foundation is being built)
