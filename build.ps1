Compress-Archive -Path blog-api/* -DestinationPath terraform/blog-api.zip
Set-Location .\terraform
terraform init
terraform apply
