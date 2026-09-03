<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" width="80" alt="VibeGuard Logo">
  <h1 align="center">VibeGuard</h1>
  <p align="center">
    <strong>AI-Powered DevSecOps Orchestrator</strong>
  </p>
</div>

> **VibeGuard is a cloud-native DevSecOps security platform that orchestrates deterministic security scanners, enforces security policies in CI/CD, provides AI-assisted remediation, and centralizes security telemetry across repositories.**

## Architecture (3-Part Distributed System)

VibeGuard is built as a highly scalable monorepo (`npm workspaces`) consisting of three core components:

### 1. The CLI (`@maverick006/vibeguard`)
- **Role:** The execution engine.
- **How it works:** A developer runs `vibeguard scan .` locally or inside a GitHub Actions CI/CD pipeline (`--ci`). The CLI spawns underlying open-source security binaries (Trivy, Semgrep, Gitleaks, Checkov, npm audit) to scan the codebase securely via `execFile`.
- **AI Auto-Remediation:** When a vulnerability is found, it selectively passes sanitized code context (scrubbing AWS keys/secrets) to the **VG-AI Engine** (powered by NVIDIA NIM), which generates a precise code fix. 
- **Telemetry:** Finally, it packages the scan results and AI fixes into a JSON payload and `POST`s it to the Backend API.

### 2. The Express Backend API (`apps/api`)
- **Role:** The central nervous system.
- **How it works:** Built with Node.js and Express, this server receives the telemetry payload via a protected webhook (`/api/scans/upload`). It validates the API key, calculates a SHA-256 fingerprint for deduplication, and stores it in SQLite (dev) or PostgreSQL (prod) via Prisma ORM.

### 3. The React Dashboard (`apps/web`)
- **Role:** The command center for Security Engineers.
- **How it works:** Built with React and Vite. It fetches the normalized data from the API and visualizes it across a sleek UI. Features include exploring vulnerabilities and side-by-side AI remediation snippets.

---

## Getting Started

### 1. Requirements
- Node.js v20+
- Supported Scanners in `$PATH` (Trivy, Semgrep, Gitleaks, Checkov).

### 2. Environment Configuration
Create a `.env` file in the root, `apps/api`, and `apps/web`:

```env
# Required for CLI and API Authentication
VIBEGUARD_API_KEY="your-secure-api-key"
VITE_VIBEGUARD_API_KEY="your-secure-api-key"
VITE_API_URL="http://localhost:3001"

# Required for AI Remediation via NVIDIA NIM
NVIDIA_API_KEY="your-nvidia-nim-key"
```

### 3. Build & Test (Root Workspace)
The root of the repository provides seamless orchestration for building the entire monorepo:

```bash
# Install dependencies across all workspaces
npm ci

# Build the entire project (Packages -> API -> Web)
npm run build

# Run the Jest test suites
npm test
```

### 4. Running the Platform
Start the API and Web Dashboard locally:

```bash
# Starts both apps/api (Port 3001) and apps/web (Port 5173)
npm run dev
```

### 5. Running a Scan
Use the CLI to scan your local project:

```bash
# Run interactive scanner
npx ts-node packages/cli/src/index.ts scan .

# Run in CI mode (Strict exit codes 0/1/2)
npx ts-node packages/cli/src/index.ts scan . --ci
```

---

## Deployment

**Docker & Infrastructure as Code (AWS)**
- The repository includes a hardened, multi-stage `Dockerfile.api` running as a non-root user.
- Production infrastructure is defined in `iac/` (Terraform) for AWS RDS (PostgreSQL) and Secrets Manager.
- *Note: AWS deployment is validated via `terraform validate` in GitHub Actions, but live deployment depends on your AWS environment setup.*

## Limitations & Experimental Features
- **Prowler/AWS CSPM:** The Prowler adapter is currently experimental.
- **Async Workers:** The scan execution model is currently synchronous within the CLI. A true server-side SQS worker pool is planned for future releases.
- **WebSockets:** The dashboard utilizes standard HTTP polling. No WebSockets are implemented.
