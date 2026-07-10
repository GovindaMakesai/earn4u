#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE_FILE="$ROOT/infrastructure/docker/docker-compose.yml"
ENV_FILE="$ROOT/infrastructure/docker/.env"

if [ ! -f "$ENV_FILE" ]; then
  cp "$ROOT/infrastructure/docker/.env.example" "$ENV_FILE"
  echo "Created $ENV_FILE from example"
fi

echo "Starting Earn4U stack..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

echo ""
echo "Earn4U stack is starting. Services:"
echo "  API:          http://localhost:${API_PORT:-3000}/api/v1/health"
echo "  Swagger:      http://localhost:${API_PORT:-3000}/docs"
echo "  Admin:        http://localhost:${ADMIN_PORT:-3001}/dashboard"
echo "  Mailpit:      http://localhost:${MAILPIT_UI_PORT:-8025}"
echo "  MinIO:        http://localhost:${MINIO_CONSOLE_PORT:-9001}"
echo "  Prometheus:   http://localhost:${PROMETHEUS_PORT:-9090}"
echo ""
echo "Check status: docker compose -f $COMPOSE_FILE ps"
