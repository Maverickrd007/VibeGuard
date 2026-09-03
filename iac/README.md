# VibeGuard Infrastructure as Code (IaC)

This directory contains the Terraform configuration to deploy the VibeGuard monorepo to AWS.

## Architecture
- **Frontend**: S3 Bucket + CloudFront (Global CDN)
- **Backend**: ECS Fargate (Serverless Docker) + Application Load Balancer
- **Registry**: AWS ECR
- **Network**: Custom VPC, Public Subnets, Security Groups

## Prerequisites
1. [AWS CLI](https://aws.amazon.com/cli/) installed and configured (`aws configure`)
2. [Terraform](https://developer.hashicorp.com/terraform/downloads) installed
3. [Docker](https://docs.docker.com/get-docker/) installed

## Deployment Steps

### 1. Initialize and Deploy Base Infrastructure
Navigate to this directory and initialize Terraform:
```bash
cd iac
terraform init
terraform apply -var="vibeguard_api_key=your_secure_api_key" -var="nvidia_api_key=your_nvidia_key" -auto-approve
```
> **Note**: You must supply the initial `vibeguard_api_key` and `nvidia_api_key` via the `-var` flag, a `terraform.tfvars` file (which is gitignored), or a CI secret. Whoever provisions this should rotate the key immediately after the first `apply` if it was ever typed in plaintext anywhere.

*Note: The ECS service might fail to stabilize initially because the ECR repository is empty. This is normal.*

### 2. Build and Push the Backend API
After the ECR repository is created, build the Docker image and push it to AWS:
```bash
# Get the ECR repository URI from the AWS Console or Terraform state
export ECR_URI="<your_account_id>.dkr.ecr.<region>.amazonaws.com/vibeguard-api"

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URI

# Build from the root of the monorepo (not the iac folder)
cd ..
docker build -t vibeguard-api -f Dockerfile.api .

# Tag and Push
docker tag vibeguard-api:latest $ECR_URI:latest
docker push $ECR_URI:latest
```
*(Once pushed, ECS will automatically pull the image and start the API)*

### 3. Deploy the Frontend
Build the Vite React app and sync it to the new S3 bucket:
```bash
# Build the frontend
npm run build --workspace=apps/web

# Sync to S3 (replace with your bucket name from Terraform output)
aws s3 sync apps/web/dist s3://vibeguard-frontend-bucket
```

### 4. Connect the Frontend to the Cloud API
Update `apps/web/src/pages/Findings.tsx` (and other pages) to replace `http://localhost:3001` with the `api_endpoint` output from Terraform (e.g., `http://vibeguard-alb-12345.us-east-1.elb.amazonaws.com`). Rebuild and re-sync the frontend to S3.

## Cleanup
To destroy all resources and stop incurring AWS charges:
```bash
terraform destroy
```
