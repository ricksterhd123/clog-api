if (Test-Path -Path terraform/blog-api.zip)
{
    terraform -chdir=terraform/ destroy -auto-approve
    Remove-Item terraform/blog-api.zip
}