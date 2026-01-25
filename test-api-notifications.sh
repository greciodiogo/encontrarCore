#!/bin/bash

# Script para testar notificações via API
# Execute: bash test-api-notifications.sh

echo ""
echo "🔔 TESTE DE NOTIFICAÇÕES VIA API"
echo "================================================================"
echo ""

# Configuração
BASE_URL="http://localhost:3381"
API_URL="$BASE_URL/api"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para fazer login e obter token
get_auth_token() {
    echo "1️⃣  Fazendo login..."
    
    # Você precisa fornecer credenciais válidas aqui
    read -p "   Email: " EMAIL
    read -sp "   Senha: " PASSWORD
    echo ""
    
    RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
    
    TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -z "$TOKEN" ]; then
        echo -e "   ${RED}✗ Falha no login${NC}"
        echo "   Response: $RESPONSE"
        exit 1
    fi
    
    echo -e "   ${GREEN}✓ Login realizado com sucesso${NC}"
    echo "   Token: ${TOKEN:0:30}..."
    echo ""
}

# Função para verificar configuração do Firebase
check_firebase_config() {
    echo "2️⃣  Verificando configuração do Firebase..."
    
    RESPONSE=$(curl -s -X GET "$API_URL/notifications/test/check-config" \
        -H "Authorization: Bearer $TOKEN")
    
    echo "   $RESPONSE" | jq '.' 2>/dev/null || echo "   $RESPONSE"
    echo ""
}

# Função para listar tokens do usuário
list_my_tokens() {
    echo "3️⃣  Listando seus tokens registrados..."
    
    RESPONSE=$(curl -s -X GET "$API_URL/notifications/test/my-tokens" \
        -H "Authorization: Bearer $TOKEN")
    
    echo "   $RESPONSE" | jq '.' 2>/dev/null || echo "   $RESPONSE"
    echo ""
}

# Função para enviar notificação de teste
send_test_notification() {
    echo "4️⃣  Enviando notificação de teste..."
    
    RESPONSE=$(curl -s -X POST "$API_URL/notifications/test/send-to-me" \
        -H "Authorization: Bearer $TOKEN")
    
    echo "   $RESPONSE" | jq '.' 2>/dev/null || echo "   $RESPONSE"
    echo ""
}

# Verificar se o servidor está rodando
echo "🔍 Verificando se o servidor está rodando..."
if ! curl -s "$BASE_URL" > /dev/null; then
    echo -e "${RED}✗ Servidor não está respondendo em $BASE_URL${NC}"
    echo ""
    echo "💡 Inicie o servidor primeiro:"
    echo "   cd encontrarCore"
    echo "   npm start"
    echo ""
    exit 1
fi
echo -e "${GREEN}✓ Servidor está rodando${NC}"
echo ""

# Verificar se jq está instalado (para formatar JSON)
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq não está instalado (JSON não será formatado)${NC}"
    echo "   Instale com: brew install jq"
    echo ""
fi

# Executar testes
get_auth_token
check_firebase_config
list_my_tokens
send_test_notification

echo "================================================================"
echo -e "${GREEN}✅ Teste concluído!${NC}"
echo ""
echo "💡 Se a notificação não chegou, verifique:"
echo "   1. App mobile está instalado e logado"
echo "   2. Token FCM foi registrado (veja output acima)"
echo "   3. Permissões de notificação estão habilitadas"
echo "   4. Firebase está configurado corretamente"
echo ""
