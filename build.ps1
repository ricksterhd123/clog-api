# Zip folder containing lambda function
Compress-Archive -Path blog-api/* -DestinationPath terraform/blog-api.zip
# Init terraform
terraform -chdir=terraform/ init
# Deploy
terraform -chdir=terraform/ apply -auto-approve