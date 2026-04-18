#!/bin/bash
# Script para processar trabalhos pendentes
# Usar no EasyPanel Cron Job com Dockerfile

curl -s -X POST "http://localhost:3000/api/cron/processar-pendentes" \
  -H "Authorization: Bearer my_cron_secret_001" \
  -H "Content-Type: application/json"