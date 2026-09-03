# Secrets Manager
resource "aws_secretsmanager_secret" "api_keys" {
  name = "${var.project_name}-api-keys"
}

resource "aws_secretsmanager_secret_version" "api_keys_initial" {
  secret_id     = aws_secretsmanager_secret.api_keys.id
  secret_string = jsonencode({
    VIBEGUARD_API_KEY = var.vibeguard_api_key
    NVIDIA_API_KEY    = var.nvidia_api_key
  })
}

resource "aws_iam_policy" "secrets_access" {
  name        = "${var.project_name}-secrets-access"
  description = "Allow ECS to read secrets"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = aws_secretsmanager_secret.api_keys.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_secrets_access" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = aws_iam_policy.secrets_access.arn
}
