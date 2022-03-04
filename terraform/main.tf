terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>3.27"
    }
  }

  backend "s3" {
    bucket = "dzwcq2zr7yfy4mhz"
    key    = "terraform-state/blog-api"
    region = "eu-west-2"
  }
  required_version = ">= 1.1.0"
}

provider "aws" {
  profile = "default"
  region  = var.region
}

#
# AWS Cognito
#

resource "aws_cognito_user_pool" "pool" {
  name = var.project_name
}

# Creates a URL that users can authorize and get tokens
resource "aws_cognito_user_pool_domain" "main" {
  domain       = var.project_name
  user_pool_id = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_user_pool_client" "client" {
  name                                 = "${var.project_name}-client"
  user_pool_id                         = aws_cognito_user_pool.pool.id
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows = [
    "code"
  ]
  allowed_oauth_scopes = [
    "email",
    "openid"
  ]
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
  generate_secret = true
  callback_urls = [
    "https://localhost:8080"
  ]
  default_redirect_uri = "https://localhost:8080"
  supported_identity_providers = [
    "COGNITO"
  ]
}

#
# DynamoDB
#

resource "aws_dynamodb_table" "blog_api_db" {
  name           = var.dynamodb_table_name
  hash_key       = var.dynamodb_hash_key_name
  range_key      = var.dynamodb_sort_key_name
  write_capacity = 1
  read_capacity  = 1

  attribute {
    name = var.dynamodb_hash_key_name
    type = "S"
  }

  attribute {
    name = var.dynamodb_sort_key_name
    type = "S"
  }

  tags = {
    Name = "${var.project_name}-db"
  }
}

#
# Lambda functions
#

resource "aws_iam_policy" "dynamodb_policy" {
  name = "${var.project_name}-dynamodb-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "dynamodb:PutItem"
        Effect = "Allow"
        Resource = aws_dynamodb_table.blog_api_db.arn
      },
      {
        Action = "dynamodb:Query"
        Effect = "Allow"
        Resource = aws_dynamodb_table.blog_api_db.arn
      },
      {
        Action = "dynamodb:UpdateItem"
        Effect = "Allow"
        Resource = aws_dynamodb_table.blog_api_db.arn
      },
      {
        Action = "dynamodb:GetItem"
        Effect = "Allow"
        Resource = aws_dynamodb_table.blog_api_db.arn
      },
      {
        Action = "dynamodb:DeleteItem"
        Effect = "Allow"
        Resource = aws_dynamodb_table.blog_api_db.arn
      }
    ]
  })
}

# Lambda function role
resource "aws_iam_role" "blog_api_role" {
  name = "${var.project_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    aws_iam_policy.dynamodb_policy.arn
  ]
}

# API lambda function
resource "aws_lambda_function" "blog_api" {
  filename      = "${var.project_name}.zip"
  function_name = "${var.project_name}-lambda"
  role          = aws_iam_role.blog_api_role.arn
  handler       = "index.dispatchEvent"

  source_code_hash = filebase64sha256("${var.project_name}.zip")
  runtime          = "nodejs14.x"

  environment {
    variables = {
      BLOG_API_DYNAMODB_TABLE_NAME    = var.dynamodb_table_name
      BLOG_API_DYNAMODB_HASH_KEY_NAME = var.dynamodb_hash_key_name
      BLOG_API_DYNAMODB_SORT_KEY_NAME = var.dynamodb_sort_key_name
      REGION                          = var.region
    }
  }
}

resource "aws_lambda_permission" "api-gateway" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.blog_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.gateway.execution_arn}/*/$default"
}

#
# API gateway v2
#

resource "aws_apigatewayv2_api" "gateway" {
  name          = "${var.project_name}-gateway"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_authorizer" "auth" {
  api_id           = aws_apigatewayv2_api.gateway.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.client.id]
    issuer   = "https://${aws_cognito_user_pool.pool.endpoint}"
  }
}

# Link the API with a lambda function
resource "aws_apigatewayv2_integration" "int" {
  api_id                 = aws_apigatewayv2_api.gateway.id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.blog_api.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "route" {
  api_id             = aws_apigatewayv2_api.gateway.id
  route_key          = "$default"
  target             = "integrations/${aws_apigatewayv2_integration.int.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.auth.id
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.gateway.id
  name        = "dev"
  auto_deploy = true
}

resource "aws_apigatewayv2_deployment" "deployment" {
  api_id = aws_apigatewayv2_api.gateway.id
  depends_on = [
    aws_apigatewayv2_route.route
  ]
}
