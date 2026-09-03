terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "vibeguard"
}

variable "vibeguard_api_key" {
  description = "Initial VibeGuard API key stored in Secrets Manager. Must be supplied at apply time."
  type        = string
  sensitive   = true
}

variable "nvidia_api_key" {
  description = "NVIDIA NIM API key stored in Secrets Manager. Must be supplied at apply time."
  type        = string
  sensitive   = true
}

