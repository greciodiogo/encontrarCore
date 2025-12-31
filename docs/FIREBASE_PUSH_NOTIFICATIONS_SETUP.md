# Firebase Push Notifications Setup Guide

Este guia mostra como configurar Push Notifications usando Firebase Cloud Messaging (FCM) no seu projeto AdonisJS com Flutter.

## 📋 Índice
1. [Setup Firebase](#setup-firebase)
2. [Configuração Backend (AdonisJS)](#configuração-backend-adonisjs)
3. [Configuração Frontend (Flutter)](#configuração-frontend-flutter)
4. [API Endpoints](#api-endpoints)
5. [Fluxo de Notificações](#fluxo-de-notificações)
6. [Testes](#testes)

---

## Setup Firebase

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Criar Projeto"**
3. Preencha o nome do projeto (ex: "Encontrar Shopping")
4. Selecione sua região
5. Clique em **"Criar Projeto"**

### 2. Gerar Chave de Serviço

1. No Firebase Console, clique em **⚙️ Configurações do Projeto**
2. Vá para a aba **"Contas de Serviço"**
3. Clique em **"Gerar Nova Chave Privada"**
4. Faça download do arquivo JSON (será usado no backend)

### 3. Ativar Firebase Cloud Messaging

1. No Firebase Console, vá para **"Build"** → **"Cloud Messaging"**
2. Clique em **"Ativar"** (se necessário)
3. Note o **Server API Key** (usado para testes manuais)

---

## Configuração Backend (AdonisJS)

### 1. Variáveis de Ambiente (.env)

```env
#################### FIREBASE ##################################
# Cole aqui o conteúdo completo do arquivo serviceAccountKey.json entre aspas duplas
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"seu-projeto-id","private_key_id":"sua-key-id","private_key":"sua-chave-privada-aqui","client_email":"firebase-adminsdk@seu-projeto.iam.gserviceaccount.com","client_id":"seu-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs"}
FIREBASE_DATABASE_URL=https://seu-projeto.firebaseio.com
```

**⚠️ Importante:** 
- Substitua os valores entre as chaves pelas credenciais do seu Firebase
- Mantenha o JSON em uma única linha no `.env`
- NUNCA commit `.env` com credenciais reais em repositório público

### 2. Executar Migrations

```bash
adonis migration:run
```

Isso criará a tabela `device_tokens` para armazenar os tokens FCM dos dispositivos.

### 3. Estrutura de Arquivos Criados

```
config/
  └── firebase.js              # Configuração e inicialização Firebase

app/
  ├── Models/
  │   └── DeviceToken.js       # Modelo para tokens de dispositivos
  ├── Services/
  │   └── FirebaseService.js   # Serviço para enviar notificações
  └── Modules/
      └── Notification/
          ├── Controllers/
          │   └── DeviceTokenController.js
          └── Routes/
              └── notification.routes.js

database/
  └── migrations/
      └── 1735689600000_device_tokens_schema.js
```

---

## Configuração Frontend (Flutter)

### 1. Adicionar Dependências

```yaml
dependencies:
  firebase_core: ^2.24.0
  firebase_messaging: ^14.6.0
  flutter_local_notifications: ^17.0.0
```

Execute: `flutter pub get`

### 2. Configurar Firebase (main.dart)

```dart
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.js';
import 'firebase_options.dart'; // Gerado automaticamente

// Handler para mensagens background
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print("Handling a background message: ${message.messageId}");
  // Aqui você pode adicionar lógica customizada
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  
  runApp(const MyApp());
}
```

### 3. Criar Serviço de Push Notifications

```dart
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class PushNotificationService {
  static final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();
  
  static Future<void> initialize() async {
    // Inicializar notificações locais (Android)
    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const DarwinInitializationSettings iosSettings =
        DarwinInitializationSettings();
    
    const InitializationSettings initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );
    
    await _localNotifications.initialize(initSettings);
    
    // Handler para mensagens em foreground
    FirebaseMessaging.onMessage.listen(_handleMessage);
    
    // Handler para clique na notificação
    FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageOpenedApp);
  }
  
  static void _handleMessage(RemoteMessage message) {
    print("Message received: ${message.notification?.title}");
    
    // Mostrar notificação local
    _localNotifications.show(
      message.hashCode,
      message.notification?.title ?? 'Notificação',
      message.notification?.body ?? '',
    );
  }
  
  static void _handleMessageOpenedApp(RemoteMessage message) {
    print("Message opened: ${message.data}");
    // Navegar para a tela apropriada baseado em message.data
  }
  
  static Future<String?> getToken() async {
    return await FirebaseMessaging.instance.getToken();
  }
}
```

### 4. Registrar Token no Backend

```dart
// Em um serviço de autenticação ou após login
import 'package:http/http.dart' as http;
import 'dart:convert';

class AuthService {
  static const String baseUrl = 'http://seu-backend.com/api/notifications';
  
  Future<void> registerDeviceToken(String authToken) async {
    try {
      String? fcmToken = await PushNotificationService.getToken();
      
      final response = await http.post(
        Uri.parse('$baseUrl/device-token/register'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
        body: jsonEncode({
          'token': fcmToken,
          'device_name': 'Flutter App Device',
          'device_type': 'mobile',
        }),
      );
      
      if (response.statusCode == 201) {
        print('Device token registered successfully');
      }
    } catch (e) {
      print('Error registering device token: $e');
    }
  }
}
```

---

## API Endpoints

### Registrar Token de Dispositivo

**POST** `/api/notifications/device-token/register`

```bash
curl -X POST http://localhost:3381/api/notifications/device-token/register \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eUdcqsqPMXN5c3X7PYbDQA:APA91bXXXXXXXXXXXXXXXX",
    "device_name": "iPhone 12",
    "device_type": "mobile"
  }'
```

**Response (201):**
```json
{
  "message": "Token registrado com sucesso",
  "data": {
    "id": 1,
    "token": "eUdcqsqPMXN5c3X7PYbDQA:APA91bXXXXXXXXXXXXXXXX",
    "device_name": "iPhone 12",
    "device_type": "mobile"
  }
}
```

### Listar Tokens do Usuário

**GET** `/api/notifications/device-token/list`

```bash
curl http://localhost:3381/api/notifications/device-token/list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**
```json
{
  "message": "Tokens listados com sucesso",
  "data": [
    {
      "id": 1,
      "token": "eUdcqsqPMXN5c3X7PYbDQA:APA91bXXXXXXXXXXXXXXXX",
      "device_name": "iPhone 12",
      "device_type": "mobile",
      "created_at": "2025-01-02T10:00:00.000Z"
    }
  ]
}
```

### Remover Token

**POST** `/api/notifications/device-token/unregister`

```bash
curl -X POST http://localhost:3381/api/notifications/device-token/unregister \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eUdcqsqPMXN5c3X7PYbDQA:APA91bXXXXXXXXXXXXXXXX"
  }'
```

---

## Fluxo de Notificações

### 1. Novo Pedido (Order Created)

```
User (Flutter App)
    ↓
[Registra Token FCM] → POST /device-token/register
    ↓
User faz Pedido → POST /orders/create
    ↓
OrderService.createdOrders()
    ↓
FirebaseService.notifyNewOrder()
    ↓
Busca tokens do cliente + sellers → Database
    ↓
Firebase Admin SDK → FCM
    ↓
Push Notification aparece no app
```

### 2. Atualização de Pedido

```python
OrderService.updatedOrder()
  ↓
FirebaseService.notifyOrderStatusUpdate()
  ↓
Firebase Admin SDK
  ↓
Push Notification (Cliente)
```

### 3. Cancelamento de Pedido

```python
OrderService.deleteOrder()
  ↓
FirebaseService.notifyOrderCancelled()
  ↓
Firebase Admin SDK
  ↓
Push Notification
```

---

## Estrutura de Dados da Notificação

### No FCM

```json
{
  "notification": {
    "title": "Pedido Confirmado",
    "body": "Seu pedido #123 foi recebido e está sendo preparado."
  },
  "data": {
    "type": "new_order",
    "orderId": "123",
    "orderStatus": "pending",
    "totalAmount": "50.00",
    "timestamp": "2025-01-02T10:00:00.000Z"
  },
  "android": {
    "priority": "high",
    "notification": {
      "sound": "default",
      "clickAction": "FLUTTER_NOTIFICATION_CLICK"
    }
  },
  "apns": {
    "headers": {
      "apns-priority": "10"
    }
  }
}
```

---

## Testes

### Teste Manual via cURL

```bash
# 1. Fazer login para obter JWT token
curl -X POST http://localhost:3381/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "senha123"
  }'

# Copie o token da resposta

# 2. Registrar token FCM
curl -X POST http://localhost:3381/api/notifications/device-token/register \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eUdcqsqPMXN5c3X7PYbDQA:APA91bXXXXXXXXXXXXXXXX",
    "device_name": "Test Device",
    "device_type": "mobile"
  }'

# 3. Criar um pedido (será enviada notificação)
curl -X POST http://localhost:3381/api/orders \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "shop_id": 1,
        "product_id": 1,
        "quantity": 2
      }
    ],
    "delivery_address": "Rua X, número 123",
    "payment_method": "card"
  }'
```

### Teste Automatizado (Node.js)

```javascript
// test-notifications.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function sendTestNotification() {
  const message = {
    notification: {
      title: 'Teste',
      body: 'Esta é uma notificação de teste'
    },
    data: {
      type: 'test',
      timestamp: new Date().toISOString()
    },
    token: 'SEU_TOKEN_FCM_AQUI'
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notificação enviada:', response);
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
  }
}

sendTestNotification();
```

Execute com: `node test-notifications.js`

---

## Troubleshooting

### 1. "Invalid Firebase Credentials"

**Solução:** Verifique se o JSON de credenciais está correto no `.env`

### 2. "Token Not Registered"

**Solução:** Certifique-se de que o usuário registrou o token antes de criar o pedido

### 3. Notificação não chega ao Android

**Solução:** 
- Verifique permissões em `AndroidManifest.xml`
- Adicione:
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### 4. Notificação não chega ao iOS

**Solução:**
- Configure certificados APNs no Firebase Console
- Verifique se o app tem permissão para notificações

---

## Resumo das Funcionalidades

✅ Registro de dispositivos com FCM  
✅ Notificação ao cliente quando pedido é criado  
✅ Notificação ao seller/shop quando novo pedido chega  
✅ Notificação de atualização de status de pedido  
✅ Notificação de cancelamento de pedido  
✅ Suporte a múltiplos dispositivos por usuário  
✅ Gerenciamento de tokens (listar, remover, desativar)  
✅ Fila de notificações com retry automático  

---

## Próximos Passos

1. ✅ Setup Firebase - Criado
2. ✅ Backend AdonisJS - Configurado
3. ✅ Flutter Integration - Pronto para integrar
4. 📌 **Adicione logística de entregas com notificações**
5. 📌 **Configure webhooks para eventos de pagamento**
6. 📌 **Implemente in-app notifications além de push**

---

## Suporte

Para mais informações:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Flutter Firebase Plugin](https://firebase.flutter.dev/)
- [AdonisJS Mail Docs](https://adonisjs.com/docs/4.1/mail)

