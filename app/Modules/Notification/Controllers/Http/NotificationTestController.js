'use strict'

/**
 * Test Controller para enviar notificações de teste
 * Endpoints:
 * - POST /api/test/notification/send
 * - GET /api/test/notification/tokens/:userId
 */

const Database = use('Database')
const FirebaseService = use('App/Services/FirebaseService')

class NotificationTestController {
  /**
   * POST /api/test/notification/send
   * Enviar notificação de teste para um usuário
   * 
   * Body:
   * {
   *   "userId": 189,
   *   "title": "Test Notification",
   *   "body": "This is a test message"
   * }
   */
  async sendTestNotification({ request, response }) {
    try {
      const { userId, title, body } = request.all()

      if (!userId || !title || !body) {
        return response.status(400).json({
          success: false,
          error: 'Missing required fields: userId, title, body'
        })
      }

      console.log(`\n📤 Attempting to send test notification to user ${userId}`)

      // Verificar se há tokens
      const tokens = await Database.table('device_tokens')
        .where('user_id', userId)
        .where('is_active', true)
        .select('token', 'device_name', 'device_type')

      console.log(`Found ${tokens.length} active tokens for user ${userId}`)

      if (tokens.length === 0) {
        return response.status(400).json({
          success: false,
          error: `No active tokens found for user ${userId}`,
          message: 'User needs to register a device token via login/signup first',
          tokens: []
        })
      }

      // Enviar notificação
      const notification = { title, body }
      const data = {
        type: 'test_notification',
        timestamp: new Date().toISOString()
      }

      await FirebaseService.notifyUser(userId, notification, data)

      return response.json({
        success: true,
        message: `Notification sent to ${tokens.length} device(s)`,
        tokens: tokens
      })

    } catch (error) {
      console.error('Error sending test notification:', error.message)
      return response.status(500).json({
        success: false,
        error: error.message,
        hint: 'Check that user has registered FCM tokens and they are from this Firebase project'
      })
    }
  }

  /**
   * GET /api/test/notification/tokens/:userId
   * Visualizar tokens registrados para um usuário
   */
  async getUserTokens({ params, response }) {
    try {
      const { userId } = params

      const tokens = await Database.table('device_tokens')
        .where('user_id', userId)
        .select('id', 'token', 'device_name', 'device_type', 'is_active', 'created_at')

      return response.json({
        success: true,
        userId: userId,
        tokenCount: tokens.length,
        tokens: tokens
      })

    } catch (error) {
      console.error('Error fetching user tokens:', error.message)
      return response.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  /**
   * POST /api/test/notification/register-test-token
   * Registrar um token de teste para um usuário
   * 
   * Body:
   * {
   *   "userId": 189,
   *   "token": "seu_token_fcm_aqui",
   *   "deviceName": "Test Device",
   *   "deviceType": "mobile"
   * }
   */
  async registerTestToken({ request, response }) {
    try {
      const { userId, token, deviceName = 'Test Device', deviceType = 'mobile' } = request.all()

      if (!userId || !token) {
        return response.status(400).json({
          success: false,
          error: 'Missing required fields: userId, token'
        })
      }

      // Verificar se usuário existe
      const user = await Database.table('users').where('id', userId).first()
      if (!user) {
        return response.status(404).json({
          success: false,
          error: `User with ID ${userId} not found`
        })
      }

      // Verificar se token já existe
      const existing = await Database.table('device_tokens')
        .where('token', token)
        .first()

      if (existing) {
        // Atualizar para ativo
        await Database.table('device_tokens')
          .where('id', existing.id)
          .update({ is_active: true })

        return response.json({
          success: true,
          message: 'Token already exists and has been activated',
          tokenId: existing.id
        })
      }

      // Inserir novo token
      const result = await Database.table('device_tokens').insert({
        user_id: userId,
        token: token,
        device_name: deviceName,
        device_type: deviceType,
        is_active: true,
        created_at: new Date()
      })

      return response.json({
        success: true,
        message: 'Test token registered successfully',
        userId: userId,
        token: token,
        deviceName: deviceName,
        deviceType: deviceType
      })

    } catch (error) {
      console.error('Error registering test token:', error.message)
      return response.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  /**
   * GET /api/test/notification/firebase-status
   * Verificar status do Firebase
   */
  async getFirebaseStatus({ response }) {
    try {
      const admin = require('firebase-admin')
      const Env = use('Env')

      const serviceAccountJson = Env.get('FIREBASE_SERVICE_ACCOUNT')
      const serviceAccount = JSON.parse(serviceAccountJson)

      return response.json({
        success: true,
        firebase: {
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          isInitialized: !!admin.apps.length,
          messagingAvailable: !!admin.messaging()
        },
        environment: {
          hasServiceAccount: !!serviceAccountJson,
          hasDatabaseUrl: !!Env.get('FIREBASE_DATABASE_URL'),
          nodeEnv: Env.get('NODE_ENV')
        }
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
}

module.exports = NotificationTestController
