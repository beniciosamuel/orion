# ORION

> Gerenciador de filmes

<img src="./docs/img/orion_constelation.jpg" width="400">

## Como rodar

Antes de inicializar, para rodar o pubsub localmente
execute o seguinte comando:

```
gcloud beta emulators pubsub start --project=<project-id>
```

## Deploy via GitHub Actions

Os workflows ficam separados em:

- `.github/workflows/server-ci-cd.yml` para o servidor e o deploy no Cloud Run.
- `.github/workflows/client-ci.yml` para lint e testes do client.

O workflow do servidor roda em `push` e `pull_request` para `master`, e o deploy é manual via `workflow_dispatch` no GitHub Actions.
Os campos editáveis do deploy são `project_id`, `service_name`, `region`, `image_registry`, `build_context`, `node_env`, `secret_name` e `secret_path`.
Os secrets obrigatórios no repositório são `GCP_WORKLOAD_IDENTITY_PROVIDER` e `GCP_SERVICE_ACCOUNT_EMAIL`.
Depois do deploy do servidor, o workflow também executa Terraform em `infra/terraform/gcp` para criar os Pub/Sub topics e os Cloud Scheduler jobs.

## Esquema do banco

<img src="./docs/img/orion_schema.png" width="800">

## Arquitetura do Serviço

<img src="./docs/img/orion_server.png" width="800">
