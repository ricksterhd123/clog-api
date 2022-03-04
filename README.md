# C(loud-based b)log API [![Main workflow](https://github.com/ricksterhd123/clog-api/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/ricksterhd123/clog-api/actions/workflows/main.yml)
## An API for my blog using AWS

## Goals
- Learn Terraform for AWS IaaC (rather than SAM/cloudformations)
- Learn how to use AWS Cognito for API gateway authorization
- Unit testing (experience++)
- CI/CD with github

## Endpoints
### Articles
- GET /articles => Get all blog articles
- GET /articles/${article_id} => Get the article with id ${article_id}
- POST /articles => Create a blog article
- PATCH /articles/${article_id} => Update a blog article
- DELETE /articles/${article_id} => Delete a blog article
