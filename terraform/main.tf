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
