#!/bin/bash
# Script de deploy para o caminho git pull + PM2.
# Rode na VPS: bash deploy.sh
set -euo pipefail

echo "==> Atualizando código..."
git pull origin main

echo "==> Instalando dependências de produção..."
npm ci --omit=dev

echo "==> Buildando Next.js..."
npm run build

echo "==> Reiniciando serviço..."
pm2 restart relatorio-fertilidade 2>/dev/null \
  || pm2 start ecosystem.config.js --env production

pm2 save
echo "==> Deploy concluído."
