# Firebase Push Notifications - Guia Rápido

## 🚀 Quick Start

### Passo 1: Obter Credenciais Firebase (5 min)
1. Vá a [console.firebase.google.com](https://console.firebase.google.com)
2. Crie/selecione seu projeto
3. Vá a **⚙️ Configurações** → **Contas de Serviço**
4. Clique **Gerar Nova Chave Privada**
5. Salve o arquivo JSON

### Passo 2: Configurar Backend (2 min)
```env
# Edite .env e adicione (mantenha em UMA linha):
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"..."}
FIREBASE_DATABASE_URL=https://seu-projeto.firebaseio.com
```

### Passo 3: Executar Migrations (1 min)
```bash
adonis migration:run
```

### Passo 4: Flutter - Registrar Token (5 min)

**Após autenticação do usuário:**
```dart
String? fcmToken = await FirebaseMessaging.instance.getToken();

var response = await http.post(
  Uri.parse('http://localhost:3381/api/notifications/device-token/register'),
  headers: {
    'Authorization': 'Bearer $jwtToken',
    'Content-Type': 'application/json',
  },
  body: jsonEncode({
    'token': fcmToken,
    'device_name': 'My Device',
    'device_type': 'mobile',
  }),
);
```

## ✅ Recursos Implementados

### Backend (AdonisJS)
- ✅ `config/firebase.js` - Configuração Firebase Admin SDK
- ✅ `app/Services/FirebaseService.js` - Serviço de notificações
- ✅ `app/Models/DeviceToken.js` - Modelo para gerenciar tokens
- ✅ `app/Modules/Notification/Controllers/DeviceTokenController.js` - APIs
- ✅ `database/migrations/*_device_tokens_schema.js` - Tabela BD
- ✅ `app/Modules/Sales/Services/OrderService.js` - Integração com pedidos

### APIs Criadas
```
POST   /api/notifications/device-token/register      # Registrar token
GET    /api/notifications/device-token/list          # Listar tokens
GET    /api/notifications/device-token/:id           # Detalhes
POST   /api/notifications/device-token/unregister    # Remover token
DELETE /api/notifications/device-token/delete-all    # Remover todos
```

### Notificações Automáticas
- **Novo Pedido**: Cliente e sellers recebem notificação quando pedido é criado
- **Atualização de Status**: Cliente notificado de mudanças no pedido
- **Cancelamento**: Cliente notificado quando pedido é cancelado

## 📱 Fluxo Completo

```
1. USER FAZE APP
   ↓
2. Firebase.initializeApp()
   ↓
3. FirebaseMessaging.getToken()
   ↓
4. POST /device-token/register (Backend)
   ↓
5. Token armazenado em device_tokens table
   ↓
6. User cria pedido
   ↓
7. OrderService.createdOrders() dispara notificação
   ↓
8. FirebaseService.notifyNewOrder()
   ↓
9. Firebase Admin SDK envia para FCM
   ↓
10. App recebe push notification
```

## 🔧 Estrutura de Diretórios Criados

```
projeto/
├── config/
│   └── firebase.js                          ← Nova
├── app/
│   ├── Models/
│   │   └── DeviceToken.js                   ← Nova
│   ├── Services/
│   │   └── FirebaseService.js               ← Nova
│   └── Modules/
│       └── Notification/
│           └── Controllers/
│               └── DeviceTokenController.js  ← Nova
├── database/
│   └── migrations/
│       └── *_device_tokens_schema.js        ← Nova
└── docs/
    ├── FIREBASE_PUSH_NOTIFICATIONS_SETUP.md ← Nova
    └── FIREBASE_NOTIFICATIONS_EXAMPLES.js    ← Nova
```

## 🧪 Testar Rapidamente

```bash
# 1. Login
curl -X POST http://localhost:3381/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}'

# Copie o token da resposta e use abaixo como YOUR_TOKEN

# 2. Registrar token FCM
curl -X POST http://localhost:3381/api/notifications/device-token/register \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token":"eUdcqsqPMXN5c3X7PYbDQA:APA91bXXXXXXXXXXXXXXXX",
    "device_name":"Test Device",
    "device_type":"mobile"
  }'

# 3. Listar tokens
curl http://localhost:3381/api/notifications/device-token/list \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Criar pedido (vai disparar notificação!)
curl -X POST http://localhost:3381/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items":[{"product_id":1,"quantity":2}],
    "delivery_address":"Rua X, 123"
  }'
```

## 📚 Documentação Completa

Veja `FIREBASE_PUSH_NOTIFICATIONS_SETUP.md` para:
- Setup Firebase detalhado
- Configuração Flutter completa
- Exemplos de código
- Troubleshooting
- Testes automatizados

## ⚠️ Importante

1. **Nunca commitar `.env` com credenciais reais** - use variáveis de ambiente
2. **Testar em device real** - emuladores podem ter problemas com FCM
3. **Verificar permissões Android/iOS** - notificações requerem permissão do usuário
4. **Implementar retry logic** - notificações podem falhar ocasionalmente

## 🆘 Problemas Comuns

| Erro | Solução |
|------|---------|
| "Invalid Credentials" | Verifique JSON no `.env` |
| "Token not registered" | Certifique-se de registrar token antes de criar pedido |
| Notificação não chega | Verifique permissões no app |
| ECONNREFUSED | Backend está rodando? |

## 📋 Próximas Integrações (Opcional)

- [ ] Notificações para entrega/logística
- [ ] Webhooks de pagamento com notificações
- [ ] Notificações in-app (além de push)
- [ ] Analytics de notificações
- [ ] Segmentação de usuários por tópicos
- [ ] Agendamento de notificações

---

**Status**: ✅ Configuração Completa e Pronta para Produção

Qualquer dúvida, consulte os arquivos de documentação em `/docs`
