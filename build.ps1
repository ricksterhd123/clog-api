# Zip folder containing lambda function
# Output must be named 'blog-api.zip' which is declared in main.tf  
Compress-Archive -Path blog-api/* -DestinationPath terraform/blog-api.zip
# Init terraform
terraform -chdir=terraform/ init
# Deploy
terraform -chdir=terraform/ apply -auto-approve