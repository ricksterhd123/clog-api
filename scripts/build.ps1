if (Test-Path -Path terraform/blog-api.zip)
{
    Remove-Item terraform/blog-api.zip
}
Set-Location -Path blog-api/
# install modules
npm install
# Go back
Set-Location -Path ../
# Zip folder containing lambda function
# Output must be named 'blog-api.zip' which is declared in main.tf  
7z a -tzip ./terraform/blog-api.zip ./blog-api/*
# Init terraform
terraform -chdir=terraform/ init
# Deploy
terraform -chdir=terraform/ apply -auto-approve