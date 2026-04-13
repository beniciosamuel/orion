variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
}

variable "region" {
  description = "Google Cloud region for Cloud Run and Cloud Scheduler jobs."
  type        = string
}

variable "pubsub_topics" {
  description = "Set of Pub/Sub topic names to create."
  type        = set(string)
  default     = []
}

variable "scheduler_service_account_email" {
  description = "Service account used by Cloud Scheduler to generate OIDC tokens for Cloud Run calls."
  type        = string
}

variable "cloud_run_base_url" {
  description = "Base URL for the Cloud Run service (for example: https://my-service-abc-uc.a.run.app)."
  type        = string
}

variable "cloud_run_cron_jobs" {
  description = "Map of Cloud Scheduler jobs that call Cloud Run endpoints."
  type = map(object({
    schedule         = string
    path             = optional(string, "")
    time_zone        = optional(string, "Etc/UTC")
    http_method      = optional(string, "POST")
    headers          = optional(map(string), {})
    body             = optional(string)
    audience         = optional(string)
    description      = optional(string)
    attempt_deadline = optional(string, "320s")
  }))
  default = {}
}
