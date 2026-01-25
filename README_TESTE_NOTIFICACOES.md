# 🔔 Como Testar Push Notifications - Guia Rápido

## ✅ Status da Configuração

- ✅ Firebase configurado no backend (Project: `encontrarmobile-d6a6e`)
- ✅ Firebase configurado no mobile app (mesmo projeto)
- ✅ Endpoints de teste criados
- ✅ Scripts de validação criados
- ✅ Correção aplicada no Flutter (firebase_options.dart)

## 🚀 Teste Rápido (3 passos)

### 1. Inicie o Backend

```bash
cd encontrarCore
npm start
```

**Verifique no console:**
```
✓ Initializing Firebase for project: encontrarmobile-d6a6e
✓ Firebase initialized successfully
```

### 2. Abra o App Mobile

```bash
cd encontrar-mobile-app
flutter run
```

**Faça login com um usuário válido.**

O app deve automaticamente:
1. Obter o token FCM do Firebase
2. Registrar o token no backend
3. Configurar listener para refresh do token

**Verifique nos logs do Flutter:**
```
FCM Token obtained: ...
✓ Device token registered successfully
```

### 3. Envie uma Notificação de Teste

#### Opção A: Via Postman/Insomnia

**Endpoint:** `POST http://localhost:3381/api/notifications/test/send-to-me`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Notificação enviada para 1 de 1 dispositivo(s)",
  "summary": {
    "total": 1,
    "success": 1,
    "failed": 0
  }
}
```

#### Opção B: Via cURL

```bash
# Substitua SEU_TOKEN_JWT pelo token obtido no login
curl -X POST http://localhost:3381/api/notifications/test/send-to-me \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

#### Opção C: Via Script (quando o banco estiver acessível)

```bash
cd encontrarCore
node test-notification-simple.js
```

## 📱 Verificar no Dispositivo

Após enviar a notificação, você deve ver:

**No dispositivo Android/iOS:**
- 🔔 Notificação aparece na barra de notificações
- Título: "🔔 Notificação de Teste"
- Corpo: "Olá [Nome]! Esta é uma notificação de teste do Encontrar."

**Se o app estiver em foreground:**
- Notificação aparece como snackbar dentro do app

## 🔍 Endpoints de Teste Disponíveis

### 1. Verificar Configuração do Firebase
```bash
GET /api/notifications/test/check-config
```

### 2. Listar Seus Tokens
```bash
GET /api/notifications/test/my-tokens
```

### 3. Enviar Notificação para Você
```bash
POST /api/notifications/test/send-to-me
```

### 4. Enviar para Token Específico
```bash
POST /api/notifications/test/send-to-token
Body: {
  "token": "fcm-token-aqui",
  "title": "Título",
  "body": "Mensagem"
}
```

### 5. Broadcast (Admin Only)
```bash
POST /api/notifications/test/broadcast
Body: {
  "title": "Título",
  "body": "Mensagem"
}
```

## 🐛 Troubleshooting

### Problema: "No tokens found for user"

**Causa:** App não registrou o token.

**Solução:**
1. Verifique se o usuário está logado
2. Verifique logs do Flutter para erros
3. Teste o endpoint de registro manualmente:

```bash
curl -X POST http://localhost:3381/api/notifications/device-token/register \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "seu-fcm-token",
    "device_name": "Test Device",
    "device_type": "android"
  }'
```

### Problema: "SenderId mismatch"

**Causa:** Token gerado com projeto Firebase diferente.

**Solução:**
1. Confirme que `google-services.json` tem `project_id: encontrarmobile-d6a6e`
2. Desinstale o app: `flutter clean`
3. Reinstale: `flutter run`
4. Faça login novamente

### Problema: Notificação não aparece

**Verificar:**
1. ✓ Permissões de notificação habilitadas no dispositivo
2. ✓ App está em background (foreground tem comportamento diferente)
3. ✓ Firebase Cloud Messaging habilitado no console Firebase
4. ✓ Dispositivo tem internet

## 📊 Validar Configuração

Execute os scripts de validação:

```bash
# Validar configuração do Firebase
node test-firebase-config.js

# Testar envio de notificação (quando banco estiver acessível)
node test-notification-simple.js
```

## 🎯 Fluxo Completo de Teste

```
1. Backend rodando ✓
   ↓
2. App mobile instalado ✓
   ↓
3. Usuário faz login ✓
   ↓
4. App obtém token FCM ✓
   ↓
5. App registra token no backend ✓
   ↓
6. Backend envia notificação de teste ✓
   ↓
7. Firebase entrega notificação ✓
   ↓
8. Dispositivo mostra notificação ✓
```

## 📝 Arquivos Criados

### Backend (encontrarCore/)
- `app/Modules/Notification/Controllers/TestNotificationController.js` - Controller de teste
- `test-firebase-config.js` - Valida configuração
- `test-notification-simple.js` - Testa envio
- `test-api-notifications.sh` - Script bash para testes
- `TESTE_PUSH_NOTIFICATIONS.md` - Guia completo
- `DIAGNOSTICO_PUSH_NOTIFICATIONS.md` - Diagnóstico detalhado
- `README_TESTE_NOTIFICACOES.md` - Este arquivo

### Mobile (encontrar-mobile-app/)
- Correção aplicada em `lib/environment/prd.main.dart`

## 🔐 Como Obter Token JWT

### Via App Mobile
O token é retornado após login e armazenado automaticamente.

### Via API
```bash
curl -X POST http://localhost:3381/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "password": "sua-senha"
  }'
```

Resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

## 💡 Próximos Passos

Após validar que as notificações funcionam:

1. ✅ Testar notificações em fluxos reais:
   - Novo pedido criado
   - Status do pedido atualizado
   - Pedido cancelado
   - Mensagens do sistema

2. ✅ Implementar notificações em foreground no Flutter

3. ✅ Adicionar deep linking para abrir telas específicas

4. ✅ Customizar sons e badges

5. ✅ Implementar notificações agendadas

## 📚 Documentação

- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Flutter Firebase Messaging](https://firebase.flutter.dev/docs/messaging/overview)
- [Documentação Completa](./docs/FIREBASE_PUSH_NOTIFICATIONS_SETUP.md)

## ✨ Exemplo de Uso em Produção

```javascript
// No backend, ao criar um pedido:
const FirebaseService = use('App/Services/FirebaseService')
const firebaseService = new FirebaseService()

await firebaseService.notifyNewOrder(order, orderItems)
```

Isso automaticamente:
1. Notifica o cliente que o pedido foi recebido
2. Notifica os parceiros (shops) sobre o novo pedido
3. Armazena a notificação no banco de dados
4. Envia push notification via Firebase

---

**Dúvidas?** Consulte os arquivos de documentação ou execute os scripts de diagnóstico.
