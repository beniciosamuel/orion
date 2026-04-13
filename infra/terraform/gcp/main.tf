locals {
  cloud_run_base_url = trimsuffix(var.cloud_run_base_url, "/")
}

resource "google_project_service" "required_apis" {
  for_each = toset([
    "pubsub.googleapis.com",
    "run.googleapis.com",
    "cloudscheduler.googleapis.com",
    "iamcredentials.googleapis.com"
  ])

  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

resource "google_pubsub_topic" "topics" {
  for_each = var.pubsub_topics

  project = var.project_id
  name    = each.value

  depends_on = [google_project_service.required_apis]
}

resource "google_cloud_scheduler_job" "cloud_run_jobs" {
  for_each = var.cloud_run_cron_jobs

  project          = var.project_id
  region           = var.region
  name             = each.key
  description      = try(each.value.description, null)
  schedule         = each.value.schedule
  time_zone        = each.value.time_zone
  attempt_deadline = each.value.attempt_deadline

  http_target {
    uri = length(trim(each.value.path, "/")) > 0 ? "${local.cloud_run_base_url}/${trim(each.value.path, "/")}" : local.cloud_run_base_url

    http_method = each.value.http_method
    headers = merge(
      {
        "Content-Type" = "application/json"
      },
      each.value.headers
    )

    body = try(each.value.body, null) == null ? null : base64encode(each.value.body)

    oidc_token {
      service_account_email = var.scheduler_service_account_email
      audience              = try(each.value.audience, null)
    }
  }

  depends_on = [google_project_service.required_apis]
}
