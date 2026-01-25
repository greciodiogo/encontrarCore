# 🔔 Guia de Teste - Push Notifications

Este guia vai te ajudar a testar e validar o sistema de push notifications do Encontrar.

## 📋 Pré-requisitos

1. ✅ Backend rodando (porta 3381)
2. ✅ App mobile instalado no emulador/dispositivo
3. ✅ Usuário logado no app mobile
4. ✅ Firebase configurado no backend (.env)

## 🔍 Passo 1: Validar Configuração do Firebase

Execute o script de validação:

```bash
cd encontrarCore
node test-firebase-config.js
```

**O que verificar:**
- ✓ Project ID corresponde ao google-services.json
- ✓ Private key está presente e bem formatada
- ✓ Todos os campos obrigatórios estão presentes

**Projeto atual:**
- Project ID: `encontrarmobile-d6a6e`
- Project Number (SenderId): `35875106082`

## 🚀 Passo 2: Iniciar o Backend

```bash
cd encontrarCore
npm start
# ou
node ace serve --dev
```

Verifique se o Firebase foi inicializado:
```
✓ Initializing Firebase for project: encontrarmobile-d6a6e
✓ Firebase initialized successfully
```

## 📱 Passo 3: Verificar Token no App Mobile

1. Abra o app mobile no emulador
2. Faça login com um usuário
3. O app deve automaticamente registrar o token FCM

**Verificar logs do app:**
- Procure por: `✓ Device token registered successfully`
- Ou: `FCM Token: ...`

## 🧪 Passo 4: Testar Notificações via API

### 4.1 Verificar seus tokens registrados

```bash
curl -X GET http://localhost:3381/api/notifications/test/my-tokens \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Encontrados X token(s)",
  "tokens": [
    {
      "id": 1,
      "device_name": "Device-...",
      "device_type": "mobile",
      "is_active": true,
      "full_token": "fcm-token-aqui..."
    }
  ]
}
```

### 4.2 Enviar notificação de teste para você mesmo

```bash
curl -X POST http://localhost:3381/api/notifications/test/send-to-me \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
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

**✅ Se funcionou:** Você deve receber a notificação no dispositivo!

### 4.3 Enviar notificação para um token específico

```bash
curl -X POST http://localhost:3381/api/notifications/test/send-to-token \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "SEU_FCM_TOKEN_AQUI",
    "title": "Teste Manual",
    "body": "Esta é uma notificação de teste"
  }'
```

### 4.4 Verificar configuração do Firebase

```bash
curl -X GET http://localhost:3381/api/notifications/test/check-config \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## 🐛 Troubleshooting

### ❌ Erro: "SenderId mismatch"

**Causa:** O token FCM foi gerado com um projeto Firebase diferente do backend.

**Solução:**
1. Verifique se `google-services.json` tem o mesmo `project_id` do backend
2. Verifique se `FIREBASE_SERVICE_ACCOUNT` no .env tem o mesmo `project_id`
3. Desinstale e reinstale o app mobile
4. Faça login novamente para gerar novo token

### ❌ Erro: "registration-token-not-registered"

**Causa:** Token expirado ou app desinstalado.

**Solução:**
1. Reinstale o app
2. Faça login novamente
3. Verifique se o token foi registrado com sucesso

### ❌ Erro: "No tokens found for user"

**Causa:** App não registrou o token no backend.

**Solução:**
1. Verifique se o app está fazendo login corretamente
2. Verifique logs do app mobile para erros de registro
3. Verifique se o endpoint `/api/notifications/device-token/register` está acessível
4. Teste manualmente o registro:

```bash
curl -X POST http://localhost:3381/api/notifications/device-token/register \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "SEU_FCM_TOKEN",
    "device_name": "Test Device",
    "device_type": "android"
  }'
```

### ❌ Notificação não aparece no dispositivo

**Verificar:**
1. ✓ Permissões de notificação estão habilitadas no dispositivo
2. ✓ App está em background (notificações em foreground precisam de tratamento especial)
3. ✓ Firebase Cloud Messaging está habilitado no projeto Firebase
4. ✓ Não há firewall bloqueando conexões do Firebase

## 📊 Endpoints de Teste Disponíveis

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/notifications/test/send-to-me` | Envia notificação para você | ✓ |
| POST | `/api/notifications/test/send-to-token` | Envia para token específico | ✓ |
| GET | `/api/notifications/test/my-tokens` | Lista seus tokens | ✓ |
| GET | `/api/notifications/test/check-config` | Verifica config Firebase | ✓ |
| POST | `/api/notifications/test/broadcast` | Envia para todos (admin) | ✓ |

## 🔐 Como obter o Token JWT

1. Faça login no app mobile ou via API
2. O token JWT é retornado no response do login
3. Use esse token no header `Authorization: Bearer TOKEN`

**Exemplo de login via API:**
```bash
curl -X POST http://localhost:3381/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "password": "sua-senha"
  }'
```

## 📝 Checklist de Validação

- [ ] Firebase configurado no backend (.env)
- [ ] Backend iniciado sem erros
- [ ] App mobile instalado e rodando
- [ ] Usuário logado no app
- [ ] Token FCM registrado no backend
- [ ] Endpoint `/test/my-tokens` retorna tokens
- [ ] Endpoint `/test/send-to-me` envia notificação
- [ ] Notificação recebida no dispositivo

## 🎯 Próximos Passos

Após validar que as notificações funcionam:

1. Testar notificações em fluxos reais (novo pedido, status atualizado, etc)
2. Implementar notificações em foreground no app mobile
3. Adicionar sons e badges customizados
4. Implementar deep linking para abrir telas específicas

## 📚 Documentação Adicional

- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Flutter Firebase Messaging](https://firebase.flutter.dev/docs/messaging/overview)
- [Documentação do Backend](./docs/FIREBASE_PUSH_NOTIFICATIONS_SETUP.md)
