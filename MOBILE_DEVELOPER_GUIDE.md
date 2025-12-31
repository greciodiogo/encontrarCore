# 📱 Guia para Mobile Developer - Flutter

Olá desenvolvedor mobile! 👋

Este documento contém tudo o que você precisa saber sobre a integração de **Push Notifications** com Firebase.

---

## 📋 O que foi implementado no Backend

```
✅ Sistema completo de notificações push
✅ APIs REST para gerenciar tokens FCM
✅ Notificações automáticas ao criar pedido
✅ Suporte a múltiplos dispositivos por usuário
✅ Tratamento de erros robusto
✅ Logging detalhado
```

---

## 🔌 APIs Disponíveis

### 1. Registrar Token FCM

**POST** `/api/notifications/device-token/register`

```bash
curl -X POST http://localhost:3381/api/notifications/device-token/register \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eUdcqsqPMXN5c3X7PYbDQA:APA91bXXXXXXXXXXXXXXXX",
    "device_name": "iPhone 12",
    "device_type": "mobile"
  }'
```

**Resposta:**
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

### 2. Listar Tokens

**GET** `/api/notifications/device-token/list`

```bash
curl http://localhost:3381/api/notifications/device-token/list \
  -H "Authorization: Bearer JWT_TOKEN"
```

### 3. Remover Token

**POST** `/api/notifications/device-token/unregister`

```bash
curl -X POST http://localhost:3381/api/notifications/device-token/unregister \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"token": "eUdcqsqPMXN5c3X7PYbDQA:APA91bXXXXXXXXXXXXXXXX"}'
```

---

## 🚀 Implementação no Flutter

### Passo 1: Adicionar Dependências

```yaml
# pubspec.yaml
dependencies:
  firebase_core: ^2.24.0
  firebase_messaging: ^14.6.0
  flutter_local_notifications: ^17.0.0
```

### Passo 2: Inicializar Firebase (main.dart)

```dart
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print("Background message: ${message.messageId}");
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  
  runApp(const MyApp());
}
```

### Passo 3: Registrar Token Após Login

```dart
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AuthService {
  static const String baseUrl = 'http://seu-backend.com/api';
  
  Future<void> registerDeviceToken(String jwtToken) async {
    try {
      // Obter token FCM
      String? fcmToken = await FirebaseMessaging.instance.getToken();
      
      if (fcmToken == null) {
        print('Failed to get FCM token');
        return;
      }
      
      // Registrar no backend
      final response = await http.post(
        Uri.parse('$baseUrl/notifications/device-token/register'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $jwtToken',
        },
        body: jsonEncode({
          'token': fcmToken,
          'device_name': 'Flutter Mobile App',
          'device_type': 'mobile',
        }),
      );
      
      if (response.statusCode == 201) {
        print('✓ Device token registered successfully');
      } else {
        print('✗ Failed to register device token');
      }
    } catch (e) {
      print('Error registering device token: $e');
    }
  }
}

// Usar após login bem-sucedido:
// await AuthService().registerDeviceToken(jwtToken);
```

### Passo 4: Escutar Notificações

```dart
class NotificationService {
  static final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  
  static Future<void> initialize() async {
    // Pedir permissão de notificação
    NotificationSettings settings = await _firebaseMessaging.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      // Mensagens em foreground
      FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

      // Clique em notificação
      FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationClick);
    }
  }

  static void _handleForegroundMessage(RemoteMessage message) {
    print('Message received: ${message.notification?.title}');
    print('Body: ${message.notification?.body}');
    print('Data: ${message.data}');
    
    // Mostrar notificação local aqui
    _showLocalNotification(message);
  }

  static void _handleNotificationClick(RemoteMessage message) {
    print('Notification clicked: ${message.data}');
    
    // Navegar baseado no tipo de notificação
    final type = message.data['type'];
    if (type == 'new_order') {
      _navigateToOrderScreen(message.data['orderId']);
    }
  }

  static void _showLocalNotification(RemoteMessage message) {
    // Implementar notificação local aqui
  }

  static void _navigateToOrderScreen(String orderId) {
    // Implementar navegação aqui
  }
}

// Chamar na inicialização do app:
// await NotificationService.initialize();
```

### Passo 5: Remover Token ao Fazer Logout

```dart
Future<void> logout(String jwtToken) async {
  // Remover todos os tokens
  final response = await http.delete(
    Uri.parse('http://seu-backend.com/api/notifications/device-token/delete-all'),
    headers: {
      'Authorization': 'Bearer $jwtToken',
    },
  );
  
  if (response.statusCode == 200) {
    print('✓ All tokens removed');
  }
}
```

---

## 📊 Estrutura de Notificação Recebida

Quando uma notificação chega, você receberá:

```json
{
  "notification": {
    "title": "Pedido Confirmado",
    "body": "Seu pedido #123 foi recebido"
  },
  "data": {
    "type": "new_order",
    "orderId": "123",
    "orderStatus": "PENDING",
    "totalAmount": "50.00",
    "timestamp": "2025-12-30T16:35:00.000Z"
  }
}
```

**Usar em seu app:**
```dart
final type = message.data['type'];
final orderId = message.data['orderId'];
final orderStatus = message.data['orderStatus'];
```

---

## 🔄 Fluxos de Notificação

### Novo Pedido
```
User cria pedido no app
  ↓
Backend envia notificação
  ↓
type = "new_order"
  ↓
App navegua para tela de pedido
```

### Atualização de Status
```
Backend atualiza status do pedido
  ↓
Envia notificação ao cliente
  ↓
type = "order_status_update"
  ↓
App mostra "Pedido em preparação"
```

### Cancelamento
```
Pedido cancelado
  ↓
Backend envia notificação
  ↓
type = "order_cancelled"
  ↓
App mostra motivo do cancelamento
```

---

## ✅ Checklist de Implementação

- [ ] Adicionar Firebase ao Flutter
- [ ] Inicializar Firebase em main.dart
- [ ] Registrar token após login
- [ ] Escutar notificações em foreground
- [ ] Escutar clique em notificação
- [ ] Navegar para a tela correta
- [ ] Remover token ao fazer logout
- [ ] Testar em dispositivo real
- [ ] Verificar permissões no app

---

## 🧪 Testes

### Teste Local

1. Implemente o código acima
2. Faça login no app
3. Copie o FCM token dos logs
4. Use o Postman para criar pedido:

```bash
curl -X POST http://localhost:3381/api/orders \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"product_id":1,"quantity":2}]}'
```

5. Verifique se a notificação chegou no app

### Teste em Produção

1. Implemente em versão de produção
2. Teste com usuários reais
3. Monitore no Firebase Console

---

## 🐛 Troubleshooting

### Notificação não chega

- [ ] Verifique se Firebase foi inicializado
- [ ] Confirme permissões de notificação foram concedidas
- [ ] Verifique se token foi registrado no backend
- [ ] Teste em dispositivo real (não emulador)

### Token não registra

- [ ] Verifique JWT token válido
- [ ] Confirme que backend está rodando
- [ ] Verifique logs do backend

### App fecha ao receber notificação

- [ ] Verifique null safety
- [ ] Adicione try-catch em handlers

---

## 📚 Documentação Completa

Para mais detalhes:
- `docs/FIREBASE_PUSH_NOTIFICATIONS_SETUP.md`
- `docs/FIREBASE_NOTIFICATIONS_EXAMPLES.js`
- `docs/FIREBASE_IMPLEMENTACAO_COMPLETA.md`

---

## 🚀 Próximos Passos

1. Implemente o código acima
2. Teste localmente
3. Teste em produção
4. Monitore no Firebase Console

Qualquer dúvida, consulte a documentação ou converse com o desenvolvedor backend.

---

**Status**: ✅ Backend 100% Pronto para Flutter  
**Data**: 30 de Dezembro de 2025
