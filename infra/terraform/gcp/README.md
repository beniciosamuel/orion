# GCP Terraform (Pub/Sub + Cloud Scheduler -> Cloud Run)

This stack creates:

- Pub/Sub topics.
- Cloud Scheduler cron jobs that call Cloud Run HTTP endpoints using OIDC tokens.

## Files

- `providers.tf`: Terraform and provider configuration.
- `variables.tf`: Input variables.
- `main.tf`: Resources (API enablement, topics, scheduler jobs).
- `outputs.tf`: Resource outputs.
- `terraform.tfvars.example`: Example values.

## Prerequisites

1. Terraform >= 1.6.
2. `gcloud` authenticated to the target project.
3. A service account used by Cloud Scheduler (variable `scheduler_service_account_email`) with permission to invoke Cloud Run.

Suggested IAM role on the target Cloud Run service for this service account:

- `roles/run.invoker`

## Usage

```bash
cd infra/terraform/gcp
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your real project/service values
terraform init
terraform plan
terraform apply
```

## Notes

- `cloud_run_base_url` is combined with each job `path`.
- If `path` is empty, the job calls the base URL directly.
- Job request `body` is automatically base64-encoded by Terraform as required by Cloud Scheduler.
