#!/bin/bash

# Cores para o output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando Deploy do Prontu para Produção...${NC}"

# 1. Verificar Build Local
echo "📦 Rodando check de build local..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build OK! Preparando deploy no Vercel...${NC}"
    
    # 2. Deploy para Produção
    npx vercel --prod
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}🎉 Deploy finalizado com sucesso! Prontu está online.${NC}"
    else
        echo -e "${RED}❌ Falha ao enviar para o Vercel.${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Erro no Build! Corrija os erros acima antes de tentar o deploy.${NC}"
    exit 1
fi
