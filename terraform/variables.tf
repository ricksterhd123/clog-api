variable "project_name" {
  type    = string
  default = "blog-api"
}

variable "region" {
  type    = string
  default = "eu-west-2"
}

variable "dynamodb_table_name" {
  type    = string
  default = "blog-api-db"
}

variable "dynamodb_hash_key_name" {
  type    = string
  default = "id"
}

variable "dynamodb_sort_key_name" {
  type    = string
  default = "type"
}
