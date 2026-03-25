# Exemplos de Teste - Sistema de Status de Loja

## Pré-requisitos

1. Executar as migrações:
```bash
node ace migration:run
```

2. Ter uma loja criada (exemplo: shop_id = 1)

## Cenário 1: Configurar Horário Simples

**Loja que abre das 8h às 17h, Segunda a Sexta**

```bash
curl -X POST http://localhost:3333/api/shops/1/business-hours \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "business_hours": [
      { "day_of_week": 1, "open_time": "08:00", "close_time": "17:00" },
      { "day_of_week": 2, "open_time": "08:00", "close_time": "17:00" },
      { "day_of_week": 3, "open_time": "08:00", "close_time": "17:00" },
      { "day_of_week": 4, "open_time": "08:00", "close_time": "17:00" },
      { "day_of_week": 5, "open_time": "08:00", "close_time": "17:00" }
    ]
  }'
```

## Cenário 2: Configurar Múltiplos Períodos

**Loja com pausa para almoço (8h-12h e 14h-18h)**

```bash
curl -X POST http://localhost:3333/api/shops/1/business-hours \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "business_hours": [
      { "day_of_week": 1, "open_time": "08:00", "close_time": "12:00" },
      { "day_of_week": 1, "open_time": "14:00", "close_time": "18:00" }
    ]
  }'
```

## Cenário 3: Verificar Status Atual

```bash
curl -X GET http://localhost:3333/api/shops/1/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Resposta esperada (se dentro do horário):**
```json
{
  "shop_id": 1,
  "shop_name": "Minha Loja",
  "current_status": "OPEN",
  "is_manual_override": false,
  "last_status_change": null,
  "business_hours": [...]
}
```

## Cenário 4: Pausar Loja Manualmente

**Útil para pausas de emergência ou quando está muito ocupado**

```bash
curl -X POST http://localhost:3333/api/shops/1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PAUSED"
  }'
```

## Cenário 5: Fechar Loja Manualmente

**Útil para feriados ou manutenção**

```bash
curl -X POST http://localhost:3333/api/shops/1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "MANUALLY_CLOSED"
  }'
```

## Cenário 6: Voltar ao Modo Automático

**Remove o override manual**

```bash
curl -X DELETE http://localhost:3333/api/shops/1/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Cenário 7: Listar Horários Configurados

```bash
curl -X GET http://localhost:3333/api/shops/1/business-hours \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Cenário 8: Atualizar Horário Específico

**Mudar horário de fechamento de 17h para 18h**

```bash
curl -X PUT http://localhost:3333/api/shops/1/business-hours/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "close_time": "18:00"
  }'
```

## Cenário 9: Deletar Horário Específico

```bash
curl -X DELETE http://localhost:3333/api/shops/1/business-hours/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Cenário 10: Deletar Todos os Horários

```bash
curl -X DELETE http://localhost:3333/api/shops/1/business-hours \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testes de Validação

### Teste 1: Horário Inválido
```bash
# Deve retornar erro
curl -X POST http://localhost:3333/api/shops/1/business-hours \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "business_hours": [
      { "day_of_week": 1, "open_time": "25:00", "close_time": "17:00" }
    ]
  }'
```

### Teste 2: Dia da Semana Inválido
```bash
# Deve retornar erro
curl -X POST http://localhost:3333/api/shops/1/business-hours \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "business_hours": [
      { "day_of_week": 7, "open_time": "08:00", "close_time": "17:00" }
    ]
  }'
```

### Teste 3: Hora de Abertura Depois do Fechamento
```bash
# Deve retornar erro
curl -X POST http://localhost:3333/api/shops/1/business-hours \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "business_hours": [
      { "day_of_week": 1, "open_time": "18:00", "close_time": "08:00" }
    ]
  }'
```

### Teste 4: Status Manual Inválido
```bash
# Deve retornar erro
curl -X POST http://localhost:3333/api/shops/1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "INVALID_STATUS"
  }'
```

## Teste de Integração Completo

```javascript
// Script de teste completo
const axios = require('axios');

const API_URL = 'http://localhost:3333/api';
const TOKEN = 'YOUR_TOKEN_HERE';
const SHOP_ID = 1;

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

async function testShopStatus() {
  try {
    // 1. Criar horários
    console.log('1. Criando horários...');
    await axios.post(
      `${API_URL}/shops/${SHOP_ID}/business-hours`,
      {
        business_hours: [
          { day_of_week: 1, open_time: "08:00", close_time: "17:00" }
        ]
      },
      { headers }
    );
    console.log('✓ Horários criados');

    // 2. Verificar status
    console.log('2. Verificando status...');
    const statusResponse = await axios.get(
      `${API_URL}/shops/${SHOP_ID}/status`,
      { headers }
    );
    console.log('✓ Status:', statusResponse.data.current_status);

    // 3. Pausar loja
    console.log('3. Pausando loja...');
    await axios.post(
      `${API_URL}/shops/${SHOP_ID}/status`,
      { status: 'PAUSED' },
      { headers }
    );
    console.log('✓ Loja pausada');

    // 4. Verificar status novamente
    console.log('4. Verificando status após pausa...');
    const pausedStatus = await axios.get(
      `${API_URL}/shops/${SHOP_ID}/status`,
      { headers }
    );
    console.log('✓ Status:', pausedStatus.data.current_status);

    // 5. Remover override
    console.log('5. Removendo override...');
    await axios.delete(
      `${API_URL}/shops/${SHOP_ID}/status`,
      { headers }
    );
    console.log('✓ Override removido');

    // 6. Verificar status final
    console.log('6. Verificando status final...');
    const finalStatus = await axios.get(
      `${API_URL}/shops/${SHOP_ID}/status`,
      { headers }
    );
    console.log('✓ Status:', finalStatus.data.current_status);

    console.log('\n✓ Todos os testes passaram!');
  } catch (error) {
    console.error('✗ Erro:', error.response?.data || error.message);
  }
}

testShopStatus();
```

## Verificação no Banco de Dados

```sql
-- Ver lojas com status
SELECT id, "shopName", status, is_manual_override, last_status_change 
FROM shops;

-- Ver horários de funcionamento
SELECT * FROM shop_business_hours WHERE shop_id = 1;

-- Ver loja com horários (join)
SELECT 
  s.id,
  s."shopName",
  s.status,
  s.is_manual_override,
  bh.day_of_week,
  bh.open_time,
  bh.close_time
FROM shops s
LEFT JOIN shop_business_hours bh ON bh.shop_id = s.id
WHERE s.id = 1;
```
