Compress-Archive -Path blog-api/* -DestinationPath terraform/blog-api.zip
terraform -chdir=terraform/ init
terraform -chdir=terraform/ apply -auto-approve
