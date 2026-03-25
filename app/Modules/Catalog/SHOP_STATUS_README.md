# Sistema de Status de Loja

## Visão Geral

Sistema que permite gerenciar o status de abertura/fechamento das lojas com base em horários de funcionamento configuráveis e controle manual.

## Estados Possíveis

- **OPEN**: Loja aberta (dentro do horário de funcionamento)
- **CLOSED**: Loja fechada (fora do horário de funcionamento)
- **PAUSED**: Loja pausada temporariamente pelo dono
- **MANUALLY_CLOSED**: Loja fechada manualmente (sobrescreve horário)

## Lógica de Funcionamento

### Modo Automático (Padrão)
- O status é calculado dinamicamente baseado nos horários de funcionamento
- Quando `is_manual_override = false`, o sistema verifica:
  1. Dia da semana atual
  2. Hora atual
  3. Se está dentro de algum período ativo
- Retorna `OPEN` se estiver dentro do horário, `CLOSED` caso contrário

### Modo Manual (Override)
- Quando `is_manual_override = true`, o status definido manualmente prevalece
- Usado para pausas, fechamentos excepcionais, etc.
- Para voltar ao modo automático, basta remover o override

## Estrutura de Dados

### Tabela: shops
```sql
- status (varchar): Status manual (quando override ativo)
- is_manual_override (boolean): Se está em modo manual
- last_status_change (timestamp): Última mudança de status
```

### Tabela: shop_business_hours
```sql
- shop_id (integer): ID da loja
- day_of_week (integer): 0-6 (Domingo-Sábado)
- open_time (varchar): Hora de abertura (HH:MM)
- close_time (varchar): Hora de fechamento (HH:MM)
- is_active (boolean): Se o horário está ativo
```

## Endpoints da API

### Status da Loja

#### GET /api/shops/:id/status
Obter status atual da loja com informações completas

**Resposta:**
```json
{
  "shop_id": 1,
  "shop_name": "Loja Exemplo",
  "current_status": "OPEN",
  "is_manual_override": false,
  "last_status_change": "2024-01-15T10:00:00.000Z",
  "business_hours": [...]
}
```

#### POST /api/shops/:id/status
Definir status manual (pausar ou fechar)

**Body:**
```json
{
  "status": "PAUSED"  // ou "MANUALLY_CLOSED"
}
```

#### DELETE /api/shops/:id/status
Remover override manual e voltar ao modo automático

### Horários de Funcionamento

#### GET /api/shops/:id/business-hours
Listar todos os horários de funcionamento da loja

#### POST /api/shops/:id/business-hours
Criar horários de funcionamento

**Body:**
```json
{
  "business_hours": [
    {
      "day_of_week": 1,
      "open_time": "08:00",
      "close_time": "12:00",
      "is_active": true
    },
    {
      "day_of_week": 1,
      "open_time": "14:00",
      "close_time": "18:00",
      "is_active": true
    }
  ]
}
```

#### PUT /api/shops/:shopId/business-hours/:id
Atualizar horário específico

#### DELETE /api/shops/:shopId/business-hours/:id
Deletar horário específico

#### DELETE /api/shops/:id/business-hours
Deletar todos os horários da loja

## Exemplos de Uso

### 1. Configurar Horário de Funcionamento

**Loja que funciona Segunda a Sexta, 8h-12h e 14h-18h:**

```bash
POST /api/shops/1/business-hours
{
  "business_hours": [
    // Segunda
    { "day_of_week": 1, "open_time": "08:00", "close_time": "12:00" },
    { "day_of_week": 1, "open_time": "14:00", "close_time": "18:00" },
    // Terça
    { "day_of_week": 2, "open_time": "08:00", "close_time": "12:00" },
    { "day_of_week": 2, "open_time": "14:00", "close_time": "18:00" },
    // Quarta
    { "day_of_week": 3, "open_time": "08:00", "close_time": "12:00" },
    { "day_of_week": 3, "open_time": "14:00", "close_time": "18:00" },
    // Quinta
    { "day_of_week": 4, "open_time": "08:00", "close_time": "12:00" },
    { "day_of_week": 4, "open_time": "14:00", "close_time": "18:00" },
    // Sexta
    { "day_of_week": 5, "open_time": "08:00", "close_time": "12:00" },
    { "day_of_week": 5, "open_time": "14:00", "close_time": "18:00" }
  ]
}
```

### 2. Pausar Loja Temporariamente

```bash
POST /api/shops/1/status
{
  "status": "PAUSED"
}
```

### 3. Voltar ao Modo Automático

```bash
DELETE /api/shops/1/status
```

### 4. Verificar Status Atual

```bash
GET /api/shops/1/status
```

## Integração no Código

### Obter Status de uma Loja

```javascript
const ShopService = use('App/Modules/Catalog/Services/ShopService')

// O status já vem calculado automaticamente
const shop = await new ShopService().findShopById(shopId)
console.log(shop.current_status) // "OPEN", "CLOSED", etc.
```

### Verificar se Loja Está Aberta

```javascript
const ShopStatusService = use('App/Modules/Catalog/Services/ShopStatusService')

const shop = await Shop.find(shopId)
const status = await new ShopStatusService().getCurrentStatus(shop)

if (status === 'OPEN') {
  // Loja está aberta
}
```

## Migrações

Para aplicar as mudanças no banco de dados:

```bash
node ace migration:run
```

Isso criará:
1. Colunas `status`, `is_manual_override`, `last_status_change` na tabela `shops`
2. Tabela `shop_business_hours` para horários de funcionamento

## Notas Importantes

1. **Eficiência**: O status é calculado on-demand, sem necessidade de cron jobs
2. **Múltiplos Períodos**: Uma loja pode ter vários períodos no mesmo dia
3. **Transição Automática**: Status muda automaticamente baseado no horário
4. **Override Manual**: Sempre tem prioridade sobre horários automáticos
5. **Sem Impacto em Pedidos**: Por enquanto, o status não afeta fluxo de pedidos

## Próximos Passos (Futuro)

- Adicionar validação de pedidos baseada no status
- Sistema de exceções para feriados
- Notificações quando loja muda de status
- Dashboard com histórico de status
- Cache de status para queries complexas
