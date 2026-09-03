<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" width="80" alt="VibeGuard Logo">
  <h1 align="center">VibeGuard</h1>
  <p align="center">
    <strong>AI-Powered DevSecOps Orchestrator</strong>
  </p>
</div>

> **VibeGuard is a cloud-native DevSecOps security platform that orchestrates deterministic security scanners, enforces security policies in CI/CD, provides AI-assisted remediation, and centralizes security telemetry across repositories.**

## 🏗️ Architecture (3-Part Distributed System)

VibeGuard is built as a highly scalable monorepo (`npm workspaces`, `turborepo`) consisting of three core components:

### 1. The CLI (`@maverick006/vibeguard`)
- **Role:** The execution engine.
- **How it works:** A developer runs `vibeguard scan .` locally or inside a GitHub Actions CI/CD pipeline. The CLI spins up underlying open-source security tools (Semgrep, Trivy, Checkov, Gitleaks) to scan the codebase.
- **AI Auto-Remediation:** When a vulnerability is found, it securely passes the broken code to the **VG-AI Engine**, which generates a precise code fix. 
- **Telemetry:** Finally, it packages the scan results and AI fixes into a JSON payload and `POST`s it to the Backend API.

### 2. The Express Backend API (`apps/api`)
- **Role:** The central nervous system.
- **How it works:** Built with Node.js and Express, this server receives the telemetry payload via a webhook (`/api/scans/upload`). It validates the API key, normalizes the security data, and stores it.
- **Endpoints:** It exposes RESTful endpoints (e.g., `/api/findings`, `/api/scans`) for the React dashboard to consume.

### 3. The React Dashboard (`apps/web`)
- **Role:** The command center for Security Engineers.
- **How it works:** Built with React, Vite, and TailwindCSS. It fetches the normalized data from the API and visualizes it across a sleek, dark-mode UI. Features include expanding vulnerabilities to see side-by-side AI remediation snippets.

---

## 🔍 The 5 Core Security Vectors Scanned

1. **SAST (Static Application Security Testing):** Scans source code for logical flaws, SQL Injections, and XSS (powered by Semgrep).
2. **SCA (Software Composition Analysis):** Scans `package.json` to find known CVEs in third-party dependencies.
3. **Secrets:** Scans Git history to catch accidentally leaked AWS API keys or database passwords.
4. **IaC (Infrastructure as Code):** Scans Terraform (`.tf`) for cloud misconfigurations.
5. **Containers:** Scans Dockerfiles and base images for OS-level vulnerabilities.

---

## 🚀 Cloud Deployment Options

**1. The Hobbyist Route (Free)**
* **Frontend:** Hosted on **Vercel** (Global CDN).
* **Backend:** Hosted on **Render.com** (Free Web Services).
* *Benefits:* Takes 5 minutes to deploy, zero cost, automatic GitHub CI/CD integration.

**2. The Enterprise Route (AWS & Terraform)**
* **Infrastructure as Code:** The repository includes an `iac/` folder containing production-grade Terraform configurations.
* **Architecture:** 
  * The React dashboard is hosted on an **AWS S3 Bucket** and served globally via **AWS CloudFront**.
  * The Express API is containerized using Docker, stored in **AWS ECR**, and run serverlessly on an **AWS ECS Fargate** cluster behind an **Application Load Balancer**.
* *Benefits:* Highly scalable, secure, and proves advanced Cloud/DevOps engineering skills. Includes GitHub Actions CI/CD for `terraform validate`.
