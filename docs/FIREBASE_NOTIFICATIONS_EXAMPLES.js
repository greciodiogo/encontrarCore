'use strict'

/**
 * ARQUIVO DE EXEMPLO - Como usar Firebase Push Notifications
 * Este arquivo mostra exemplos práticos de como enviar notificações
 * em diferentes cenários do seu app.
 */

// =====================================================
// 1. USAR FIREBASE SERVICE NO ORDER CONTROLLER
// =====================================================

class OrderController {
  // Este código já está implementado em OrderService.createdOrders()
  // Mas aqui mostra como seria manualmente:

  async store({ request, response, auth }) {
    try {
      const user = await auth.getUser()
      const FirebaseService = use('App/Services/FirebaseService')
      const OrderService = use('App/Modules/Sales/Services/OrderService')

      // Criar pedido
      const order = await OrderService.createdOrders(request.all(), user.id)
      // Notificações são enviadas automaticamente dentro de createdOrders()

      return response.status(201).json({
        message: 'Pedido criado com sucesso',
        data: order
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao criar pedido',
        error: error.message
      })
    }
  }
}

// =====================================================
// 2. ENVIAR NOTIFICAÇÃO DE STATUS DE PEDIDO
// =====================================================

class AdminController {
  async acceptOrderByShop({ params, response, auth }) {
    try {
      const Order = use('App/Models/Order')
      const FirebaseService = use('App/Services/FirebaseService')

      const order = await Order.find(params.id)
      if (!order) {
        return response.status(404).json({ message: 'Pedido não encontrado' })
      }

      // Atualizar status
      order.status = 'accepted'
      await order.save()

      // Enviar notificação ao cliente
      const firebaseService = new FirebaseService()
      await firebaseService.notifyOrderStatusUpdate(
        order,
        'accepted',
        'Seu pedido foi aceite e está sendo preparado!'
      )

      return response.json({
        message: 'Pedido aceite com sucesso',
        data: order
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao aceitar pedido',
        error: error.message
      })
    }
  }

  async cancelOrderByShop({ params, request, response, auth }) {
    try {
      const Order = use('App/Models/Order')
      const FirebaseService = use('App/Services/FirebaseService')

      const order = await Order.find(params.id)
      if (!order) {
        return response.status(404).json({ message: 'Pedido não encontrado' })
      }

      const { reason } = request.all()

      // Cancelar pedido
      order.status = 'cancelled'
      await order.save()

      // Enviar notificação de cancelamento
      const firebaseService = new FirebaseService()
      await firebaseService.notifyOrderCancelled(order, reason)

      return response.json({
        message: 'Pedido cancelado com sucesso',
        data: order
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao cancelar pedido',
        error: error.message
      })
    }
  }
}

// =====================================================
// 3. NOTIFICAÇÕES VIA TOPICS (PARA BROADCASTS)
// =====================================================

class PromotionController {
  /**
   * Enviar notificação de promoção para todos os usuários inscritos
   */
  async notifyAllUsers({ request, response }) {
    try {
      const { title, message } = request.all()
      const FirebaseService = use('App/Services/FirebaseService')
      const firebaseService = new FirebaseService()

      // Enviar para o tópico 'promotions'
      await firebaseService.notifyTopic('promotions', {
        title: title,
        body: message
      })

      return response.json({
        message: 'Promoção notificada a todos os usuários'
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao enviar notificação',
        error: error.message
      })
    }
  }

  /**
   * Inscrever usuário no tópico de promoções (chamar após login)
   */
  async subscribeToPromotions({ response, auth }) {
    try {
      const user = await auth.getUser()
      const FirebaseService = use('App/Services/FirebaseService')
      const firebaseService = new FirebaseService()

      await firebaseService.subscribeUserToTopic(user.id, 'promotions')

      return response.json({
        message: 'Inscrição realizada com sucesso'
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao inscrever',
        error: error.message
      })
    }
  }
}

// =====================================================
// 4. NOTIFICAÇÕES EM EVENTOS
// =====================================================

/**
 * Em start/events.js
 */
class EventListener {
  async handle(eventData) {
    const Event = use('Event')
    const FirebaseService = use('App/Services/FirebaseService')

    // Exemplo: quando um delivery é atribuído
    Event.on('delivery:assigned', async (delivery) => {
      try {
        const User = use('App/Models/User')
        const deliveryPerson = await User.find(delivery.user_id)
        const order = await delivery.order()

        const firebaseService = new FirebaseService()
        await firebaseService.notifyUser(deliveryPerson.id, {
          title: 'Novo Delivery',
          body: `Você tem um novo delivery do pedido #${order.id}`
        }, {
          type: 'delivery_assigned',
          deliveryId: delivery.id.toString(),
          orderId: order.id.toString()
        })
      } catch (error) {
        console.error('Error in delivery:assigned event:', error.message)
      }
    })
  }
}

// =====================================================
// 5. USAR EM JOBS/QUEUES (CELERY-LIKE)
// =====================================================

/**
 * app/Jobs/SendNotificationJob.js
 */
class SendNotificationJob {
  static get key() {
    return 'send-notification'
  }

  async handle(job) {
    const { userId, notification, data } = job.data
    const FirebaseService = use('App/Services/FirebaseService')

    try {
      const firebaseService = new FirebaseService()
      await firebaseService.notifyUser(userId, notification, data)
      
      console.log(`Notification sent to user ${userId}`)
    } catch (error) {
      console.error('Error in SendNotificationJob:', error.message)
      // Requeue job
      throw error
    }
  }
}

// Usar assim:
// const Queue = use('Queue')
// Queue.dispatch('send-notification', {
//   userId: 1,
//   notification: { title: 'Teste', body: 'Mensagem de teste' },
//   data: { type: 'test' }
// })

// =====================================================
// 6. EXEMPLO COMPLETO - FLUTTER APP INTEGRATION
// =====================================================

/*
// flutter/lib/services/notification_service.dart

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config/constants.dart';

class NotificationService {
  static final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  
  static Future<void> initialize(String authToken) async {
    // Obter permissões
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
      // Obter token FCM
      String? token = await _firebaseMessaging.getToken();
      print('FCM Token: $token');

      // Registrar no backend
      await _registerTokenWithBackend(token, authToken);

      // Handler para mensagens em foreground
      FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

      // Handler para clique em notificação
      FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationClick);
    }
  }

  static Future<void> _registerTokenWithBackend(
    String? token,
    String authToken,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('${Constants.apiUrl}/api/notifications/device-token/register'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
        body: jsonEncode({
          'token': token,
          'device_name': 'Flutter Mobile App',
          'device_type': 'mobile',
        }),
      );

      if (response.statusCode == 201) {
        print('Device token registered successfully');
      }
    } catch (e) {
      print('Error registering token: $e');
    }
  }

  static void _handleForegroundMessage(RemoteMessage message) {
    print('Message received in foreground:');
    print('Title: ${message.notification?.title}');
    print('Body: ${message.notification?.body}');
    print('Data: ${message.data}');

    // Processar dados customizados
    final type = message.data['type'];
    _handleNotificationData(type, message.data);
  }

  static void _handleNotificationClick(RemoteMessage message) {
    print('Notification clicked:');
    print('Data: ${message.data}');

    final type = message.data['type'];
    _handleNotificationData(type, message.data);
  }

  static void _handleNotificationData(String? type, Map<String, dynamic> data) {
    switch (type) {
      case 'new_order':
        // Navegar para tela de pedido
        _navigateToOrderScreen(data['orderId']);
        break;
      case 'order_status_update':
        // Atualizar UI com novo status
        _updateOrderStatus(data['orderId'], data['orderStatus']);
        break;
      case 'order_cancelled':
        // Mostrar dialogo de cancelamento
        _showCancelledDialog(data['reason']);
        break;
      default:
        print('Unknown notification type: $type');
    }
  }

  static void _navigateToOrderScreen(String orderId) {
    // Implementar navegação
  }

  static void _updateOrderStatus(String orderId, String status) {
    // Implementar atualização
  }

  static void _showCancelledDialog(String reason) {
    // Implementar dialogo
  }
}
*/

// =====================================================
// 7. TESTES UNITÁRIOS
// =====================================================

/*
// test/notifications.test.js
const test = require('japa')
const { test: apiTest } = require('@adonisjs/ace')

test('Register device token', async (assert) => {
  const response = await supertest(this.app)
    .post('/api/notifications/device-token/register')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      token: 'test-token-123',
      device_name: 'Test Device',
      device_type: 'mobile'
    })

  assert.equal(response.status, 201)
  assert.exists(response.body.data.id)
})

test('List user device tokens', async (assert) => {
  const response = await supertest(this.app)
    .get('/api/notifications/device-token/list')
    .set('Authorization', `Bearer ${authToken}`)

  assert.equal(response.status, 200)
  assert.isArray(response.body.data)
})
*/

module.exports = {
  OrderController,
  AdminController,
  PromotionController,
  EventListener,
  SendNotificationJob
}
