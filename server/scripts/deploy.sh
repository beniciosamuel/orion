#!/usr/bin/env bash
set -e

# ========================
# Configurações
# ========================
PROJECT_ID="orion-492812"
SERVICE_NAME="orion-server"
REGION="us-central1"
IMAGE="gcr.io/$PROJECT_ID/$SERVICE_NAME"

SECRET_NAME="orion_server"
SECRET_PATH="/app/.env/secrets.json"

# ========================
# Autenticação e contexto
# ========================
gcloud config set project "$PROJECT_ID"

# ========================
# Build da imagem
# ========================
gcloud builds submit \
  --tag "$IMAGE"

# ========================
# Deploy no Cloud Run
# ========================
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --set-secrets="${SECRET_PATH}=${SECRET_NAME}:latest"

echo "🚀 Deploy finalizado com sucesso!"
