terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~>3.27"
        }
    }

    backend "s3" {
        bucket = "dzwcq2zr7yfy4mhz"
        key = "terraform-state/blog-api"
        region = "eu-west-2"
    }
    required_version = ">= 1.1.0"
}

provider "aws" {
    profile = "default"
    region = "eu-west-2"
}

#
# AWS Cognito
#

resource "aws_cognito_user_pool" "pool" {
  name = "example_user_pool"
}

# Creates a URL that users can authorize and get tokens
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "blog-api"
  user_pool_id = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_user_pool_client" "client" {
  name = "example_external_api"
  user_pool_id = aws_cognito_user_pool.pool.id
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
# Lambda functions
#

# Lambda function role
resource "aws_iam_role" "blog_api_role" {
    name = "blog-api-role"

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
}

# API lambda function
resource "aws_lambda_function" "blog_api" {
    filename = "blog-api.zip"
    function_name = "blog-api"
    role = aws_iam_role.blog_api_role.arn
    handler = "index.get"

    source_code_hash = filebase64sha256("blog-api.zip")
    runtime = "nodejs14.x"

    environment {
        variables = {
            foo = "bar"
        }
    }
}

#
# API gateway v2
#

resource "aws_apigatewayv2_api" "gateway" {
  name = "example_api"
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
# TODO: Why is the event not linking properly? Permissions?
resource "aws_apigatewayv2_integration" "int" {
  api_id           = aws_apigatewayv2_api.gateway.id
  integration_type = "AWS_PROXY"
  connection_type = "INTERNET"
  integration_method = "POST"
  integration_uri = aws_lambda_function.blog_api.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "route" {
  api_id    = aws_apigatewayv2_api.gateway.id
  route_key = "GET /"
  target = "integrations/${aws_apigatewayv2_integration.int.id}"
  authorization_type = "JWT"
  authorizer_id = aws_apigatewayv2_authorizer.auth.id
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id = aws_apigatewayv2_api.gateway.id
  name = "dev-api"
  auto_deploy = true
}

resource "aws_apigatewayv2_deployment" "deployment" {
  api_id = aws_apigatewayv2_api.gateway.id
  depends_on = [
    aws_apigatewayv2_route.route
  ]
}

resource "aws_lambda_permission" "api-gateway" {
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.blog_api.function_name
  principal = "apigateway.amazonaws.com"
  source_arn = aws_apigatewayv2_api.gateway.execution_arn
  depends_on = [
    aws_lambda_function.blog_api,
    aws_apigatewayv2_api.gateway,
    aws_apigatewayv2_integration.int
  ]
}
