# VibeGuard

VibeGuard is a deterministic DevSecOps orchestration engine designed for the AI-built software era.

## Features
- **7 Modular Scanners**: SAST, DAST, SCA, Secrets, Containers, and CSPM.
- **Deterministic Math**: A mathematically pure A-F scoring algorithm.
- **AI Remediation**: No hallucinations. Just context-aware code fixes powered by Gemini.

## Workspaces
- `apps/web`: React Frontend (Vite + Tailwind v4 + Shadcn)
- `apps/api`: Express Backend + Prisma SQLite
- `packages/cli`: Command-Line Interface (`@vibeguard/cli`)
- `packages/ai-engine`: Contextual Explainer utilizing Gemini (`@vibeguard/ai-engine`)
- `packages/types`: Shared Typescript types
- `scanners/*`: Deterministic adapter wrappers for open source scanners

## Getting Started
Ensure you have `GEMINI_API_KEY` set in your environment.

### Run Locally
```bash
npm install

# Start API
npm run dev --workspace=apps/api

# Start Web Dashboard
npm run dev --workspace=apps/web
```

### Docker
```bash
docker-compose up --build
```

### Try the CLI
```bash
node packages/cli/dist/index.js scan --fix
```
