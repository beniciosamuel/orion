output "pubsub_topics" {
  description = "Created Pub/Sub topics keyed by topic name."
  value       = { for topic_name, topic in google_pubsub_topic.topics : topic_name => topic.name }
}

output "cloud_scheduler_jobs" {
  description = "Created Cloud Scheduler jobs keyed by job name."
  value       = { for job_name, job in google_cloud_scheduler_job.cloud_run_jobs : job_name => job.name }
}
