# Instalação - Sistema de Status de Loja

## Arquivos Criados

### Migrations
- `database/migrations/1770600000000_add_shop_status_fields_schema.js`
- `database/migrations/1770600000001_shop_business_hours_schema.js`

### Models
- `app/Modules/Catalog/Models/ShopBusinessHours.js`
- `app/Modules/Catalog/Models/Shops.js` (atualizado)

### Repositories
- `app/Modules/Catalog/Repositories/ShopBusinessHoursRepository.js`

### Services
- `app/Modules/Catalog/Services/ShopStatusService.js`
- `app/Modules/Catalog/Services/ShopBusinessHoursService.js`
- `app/Modules/Catalog/Services/ShopService.js` (atualizado)

### Controllers
- `app/Modules/Catalog/Controllers/ShopStatusController.js`
- `app/Modules/Catalog/Controllers/ShopBusinessHoursController.js`

### Routes
- `app/Modules/Catalog/Routes/shop-status.routes.js`

### Constants
- `app/Modules/Catalog/Constants/ShopStatus.js`

### Validators
- `app/Modules/Catalog/Validators/ShopBusinessHours.js`
- `app/Modules/Catalog/Validators/ShopStatus.js`

### Documentação
- `docs/Catalog/ShopStatus.js` (Swagger)
- `app/Modules/Catalog/SHOP_STATUS_README.md`
- `SHOP_STATUS_EXAMPLES.md`
- `SHOP_STATUS_INSTALLATION.md` (este arquivo)

## Passos de Instalação

### 1. Executar Migrations

```bash
cd encontrar/encontrarCore
node ace migration:run
```

Isso criará:
- Colunas na tabela `shops`: `status`, `is_manual_override`, `last_status_change`
- Tabela `shop_business_hours`

### 2. Verificar Banco de Dados

```sql
-- Verificar se as colunas foram adicionadas
\d shops

-- Verificar se a tabela foi criada
\d shop_business_hours
```

### 3. Reiniciar o Servidor

```bash
# Se estiver rodando, pare o servidor
# Ctrl+C

# Inicie novamente
npm start
# ou
node server.js
```

### 4. Testar Endpoints

#### Verificar se as rotas estão registradas:

```bash
node ace route:list | grep shops
```

Você deve ver:
```
GET    /api/shops/:id/status
POST   /api/shops/:id/status
DELETE /api/shops/:id/status
GET    /api/shops/:id/business-hours
POST   /api/shops/:id/business-hours
PUT    /api/shops/:shopId/business-hours/:id
DELETE /api/shops/:shopId/business-hours/:id
DELETE /api/shops/:id/business-hours
```

#### Teste básico:

```bash
# Substitua YOUR_TOKEN e SHOP_ID
curl -X GET http://localhost:3333/api/shops/1/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Estrutura de Banco de Dados

### Tabela: shops (alterações)

```sql
ALTER TABLE shops 
ADD COLUMN status VARCHAR(30),
ADD COLUMN is_manual_override BOOLEAN DEFAULT false,
ADD COLUMN last_status_change TIMESTAMP;
```

### Tabela: shop_business_hours (nova)

```sql
CREATE TABLE shop_business_hours (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  open_time VARCHAR(5) NOT NULL,
  close_time VARCHAR(5) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Endpoints Disponíveis

### Status da Loja
- `GET /api/shops/:id/status` - Obter status atual
- `POST /api/shops/:id/status` - Definir status manual
- `DELETE /api/shops/:id/status` - Remover override manual

### Horários de Funcionamento
- `GET /api/shops/:id/business-hours` - Listar horários
- `POST /api/shops/:id/business-hours` - Criar horários
- `PUT /api/shops/:shopId/business-hours/:id` - Atualizar horário
- `DELETE /api/shops/:shopId/business-hours/:id` - Deletar horário
- `DELETE /api/shops/:id/business-hours` - Deletar todos os horários

## Permissões

Os endpoints de modificação (POST, PUT, DELETE) requerem:
- Autenticação (`auth` middleware)
- Role: `admin`, `manager`, ou `sales`

Os endpoints de leitura (GET) requerem apenas autenticação.

## Troubleshooting

### Erro: "Migration already exists"
```bash
# Verificar migrations executadas
node ace migration:status

# Se necessário, fazer rollback
node ace migration:rollback
```

### Erro: "Route not found"
```bash
# Verificar se as rotas estão carregadas
node ace route:list

# Reiniciar o servidor
npm start
```

### Erro: "Cannot find module"
```bash
# Verificar se todos os arquivos foram criados
ls -la app/Modules/Catalog/Services/ShopStatusService.js
ls -la app/Modules/Catalog/Controllers/ShopStatusController.js
```

### Erro de Validação
```bash
# Verificar se os validadores estão corretos
ls -la app/Modules/Catalog/Validators/
```

## Verificação de Funcionamento

### Script de Teste Rápido

```javascript
// test-shop-status.js
const axios = require('axios');

const API_URL = 'http://localhost:3333/api';
const TOKEN = 'YOUR_TOKEN';
const SHOP_ID = 1;

async function test() {
  try {
    const response = await axios.get(
      `${API_URL}/shops/${SHOP_ID}/status`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    console.log('✓ Sistema funcionando!');
    console.log('Status:', response.data);
  } catch (error) {
    console.error('✗ Erro:', error.response?.data || error.message);
  }
}

test();
```

Execute:
```bash
node test-shop-status.js
```

## Próximos Passos

1. Configurar horários de funcionamento para suas lojas
2. Testar transições automáticas de status
3. Integrar status no fluxo de pedidos (se necessário)
4. Adicionar notificações de mudança de status (futuro)

## Suporte

Para mais informações, consulte:
- `SHOP_STATUS_README.md` - Documentação completa
- `SHOP_STATUS_EXAMPLES.md` - Exemplos de uso
- `docs/Catalog/ShopStatus.js` - Documentação Swagger
