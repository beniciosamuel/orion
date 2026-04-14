pubsub_topics = [
  "orion-movie-events",
  "orion-notifications",
]

cloud_run_cron_jobs = {
  "orion-get-released-movies-daily" = {
    description = "Trigger released movies job every day at 18:00"
    schedule    = "0 18 * * *"
    time_zone   = "America/Sao_Paulo"
    http_method = "POST"
    path        = "cronjobs/getReleasedMovies"
    body        = jsonencode({
      source = "cloud-scheduler"
      job    = "orion-get-released-movies-daily"
    })
  }
}
