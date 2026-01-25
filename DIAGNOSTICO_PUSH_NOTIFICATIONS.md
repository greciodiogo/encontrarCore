# 🔍 Diagnóstico - Push Notifications

## ✅ Validações Realizadas

### 1. Configuração do Firebase

**Backend (.env):**
- ✅ Project ID: `encontrarmobile-d6a6e`
- ✅ Private Key: Presente e válida
- ✅ Client Email: `firebase-adminsdk-fbsvc@encontrarmobile-d6a6e.iam.gserviceaccount.com`

**Mobile App (google-services.json):**
- ✅ Project ID: `encontrarmobile-d6a6e`
- ✅ Project Number (SenderId): `35875106082`
- ✅ Package Name: `co.ao.encontrar_mobile_app`

**iOS (GoogleService-Info.plist):**
- ✅ Project ID: `encontrarmobile-d6a6e`
- ✅ GCM Sender ID: `35875106082`
- ✅ Bundle ID: `co.ao.encontrarMobileApp`

### 2. Ecossistema Firebase

✅ **TODOS OS COMPONENTES ESTÃO NO MESMO PROJETO FIREBASE**
- Backend e Mobile App usam: `encontrarmobile-d6a6e`
- SenderId é consistente: `35875106082`

## 🎯 Próximos Passos para Testar

### Passo 1: Iniciar o Backend

```bash
cd encontrarCore
npm start
```

Verifique no console:
```
✓ Initializing Firebase for project: encontrarmobile-d6a6e
✓ Firebase initialized successfully
```

### Passo 2: Verificar se o App Mobile Está Registrando Tokens

No código do Flutter, o registro acontece em:
- `lib/environment/prd.main.dart` (linha 53)
- `lib/src/modules/notifications/service/push_notification_registration_service.dart`

**Endpoint usado:** `POST /api/notifications/device-token/register`

**O que o app envia:**
```json
{
  "token": "fcm-token-aqui",
  "device_name": "Device-timestamp",
  "device_type": "mobile"
}
```

### Passo 3: Testar Manualmente

#### Opção A: Via Script Node.js

```bash
cd encontrarCore
node test-notification-simple.js
```

Este script:
1. Conecta ao banco de dados
2. Busca tokens ativos
3. Envia notificação de teste
4. Mostra diagnóstico de erros

#### Opção B: Via API REST

1. **Fazer login:**
```bash
curl -X POST http://localhost:3381/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"sua-senha"}'
```

2. **Verificar seus tokens:**
```bash
curl -X GET http://localhost:3381/api/notifications/test/my-tokens \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

3. **Enviar notificação de teste:**
```bash
curl -X POST http://localhost:3381/api/notifications/test/send-to-me \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

#### Opção C: Via Script Bash

```bash
cd encontrarCore
chmod +x test-api-notifications.sh
./test-api-notifications.sh
```

## 🐛 Possíveis Problemas e Soluções

### Problema 1: "No tokens found for user"

**Causa:** App mobile não registrou o token no backend.

**Verificar:**
1. App está fazendo login corretamente?
2. Endpoint `/api/notifications/device-token/register` está acessível?
3. Há erros nos logs do app mobile?

**Solução:**
```dart
// No Flutter, após login bem-sucedido:
final pushService = locator<PushNotificationRegistrationService>();
await pushService.registerDeviceToken(
  authToken: authToken,
  baseUrl: baseUrl,
);
```

### Problema 2: "SenderId mismatch"

**Causa:** Token foi gerado com projeto Firebase diferente.

**Verificar:**
1. `google-services.json` tem o mesmo `project_id` do backend?
2. App foi recompilado após atualizar `google-services.json`?

**Solução:**
1. Confirme que todos usam `encontrarmobile-d6a6e`
2. Desinstale o app completamente
3. Recompile: `flutter clean && flutter run`
4. Faça login novamente

### Problema 3: "registration-token-not-registered"

**Causa:** Token expirado ou app desinstalado.

**Solução:**
1. Reinstale o app
2. Faça login novamente
3. Token será regenerado automaticamente

### Problema 4: Notificação não aparece no dispositivo

**Verificar:**
1. ✓ Permissões de notificação habilitadas?
2. ✓ App está em background? (foreground precisa tratamento especial)
3. ✓ Dispositivo tem conexão com internet?
4. ✓ Firebase Cloud Messaging está habilitado no console?

**Testar permissões no Flutter:**
```dart
final settings = await FirebaseMessaging.instance.requestPermission(
  alert: true,
  badge: true,
  sound: true,
);
print('Permission status: ${settings.authorizationStatus}');
```

## 📊 Endpoints de Teste Criados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/notifications/test/send-to-me` | POST | Envia notificação para você |
| `/api/notifications/test/send-to-token` | POST | Envia para token específico |
| `/api/notifications/test/my-tokens` | GET | Lista seus tokens |
| `/api/notifications/test/check-config` | GET | Verifica config Firebase |
| `/api/notifications/test/broadcast` | POST | Broadcast (admin only) |

## 🔧 Ferramentas de Debug

### 1. Validar Configuração
```bash
node test-firebase-config.js
```

### 2. Testar Notificação
```bash
node test-notification-simple.js
```

### 3. Testar via API
```bash
./test-api-notifications.sh
```

## 📝 Checklist de Validação

- [x] Firebase configurado no backend
- [x] google-services.json no app Android
- [x] GoogleService-Info.plist no app iOS
- [x] Todos usam o mesmo projeto Firebase
- [x] Endpoints de teste criados
- [ ] Backend está rodando
- [ ] App mobile instalado no emulador
- [ ] Usuário logado no app
- [ ] Token FCM registrado no backend
- [ ] Notificação de teste enviada
- [ ] Notificação recebida no dispositivo

## 🎯 Ação Imediata

1. **Inicie o backend:**
   ```bash
   cd encontrarCore
   npm start
   ```

2. **Abra o app mobile no emulador**

3. **Faça login com um usuário**

4. **Execute o teste:**
   ```bash
   # Opção 1: Via script
   node test-notification-simple.js
   
   # Opção 2: Via API
   curl -X POST http://localhost:3381/api/notifications/test/send-to-me \
     -H "Authorization: Bearer SEU_TOKEN"
   ```

5. **Verifique se a notificação chegou no dispositivo**

## 📚 Arquivos Criados

1. `TestNotificationController.js` - Controller com endpoints de teste
2. `test-firebase-config.js` - Valida configuração do Firebase
3. `test-notification-simple.js` - Testa envio de notificações
4. `test-api-notifications.sh` - Script bash para testes via API
5. `TESTE_PUSH_NOTIFICATIONS.md` - Guia completo de testes
6. `DIAGNOSTICO_PUSH_NOTIFICATIONS.md` - Este arquivo

## 💡 Dicas

- Use o endpoint `/test/my-tokens` para ver todos os tokens registrados
- Use o endpoint `/test/send-to-me` para testar rapidamente
- Logs do Firebase aparecem no console do backend
- Logs do app mobile aparecem no console do Flutter
