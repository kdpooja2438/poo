terraform {
  required_version = ">= 1.5.0"

  required_providers {
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
}

resource "random_pet" "app_name" {
  length = 2
}

resource "local_file" "deployment_info" {
  filename = "${path.module}/deployment_info.txt"
  content  = "Grand Stay Hotel deployment identifier: ${random_pet.app_name.id}\n"
}

output "app_name" {
  value = random_pet.app_name.id
}
