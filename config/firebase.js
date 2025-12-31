'use strict'

const Env = use('Env')
const admin = require('firebase-admin')

let firebaseApp = null

class FirebaseProvider {
  /**
   * Inicializa Firebase Admin SDK
   */
  static initialize() {
    if (firebaseApp) {
      return firebaseApp
    }

    try {
      // Obtém as credenciais do arquivo JSON ou das variáveis de ambiente
      const serviceAccount = JSON.parse(Env.get('FIREBASE_SERVICE_ACCOUNT'))

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: Env.get('FIREBASE_DATABASE_URL', '')
      })

      console.log('Firebase initialized successfully')
      return firebaseApp
    } catch (error) {
      console.error('Error initializing Firebase:', error.message)
      throw error
    }
  }

  /**
   * Envia uma notificação push para um dispositivo específico
   * @param {string} token - Token FCM do dispositivo
   * @param {object} notification - Objeto com title e body
   * @param {object} data - Dados adicionais a enviar
   */
  static async sendNotification(token, notification, data = {}) {
    if (!firebaseApp) {
      this.initialize()
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      token: token,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK'
        }
      },
      apns: {
        headers: {
          'apns-priority': '10'
        },
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    }

    try {
      const response = await admin.messaging().send(message)
      console.log('Notification sent successfully:', response)
      return response
    } catch (error) {
      console.error('Error sending notification:', error.message)
      throw error
    }
  }

  /**
   * Envia notificação para múltiplos dispositivos
   * @param {array} tokens - Array de tokens FCM
   * @param {object} notification - Objeto com title e body
   * @param {object} data - Dados adicionais
   */
  static async sendMulticast(tokens, notification, data = {}) {
    if (!firebaseApp) {
      this.initialize()
    }

    if (tokens.length === 0) {
      console.log('No tokens provided for multicast')
      return { successCount: 0, failureCount: 0 }
    }

  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK'
        }
      },
      apns: {
        headers: {
          'apns-priority': '10'
        }
      },
        tokens: tokens
      }

      // Usar sendEachForMulticast - API correta para múltiplos dispositivos
      const response = await admin.messaging().sendEachForMulticast(message)

      console.log(`Multicast sent. Success: ${response.successCount}, Failed: ${response.failureCount}`)
      
      // Limpar tokens que falharam
      if (response.failureCount > 0) {
        const failedTokens = []
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx])
          }
        })
        console.log('Failed tokens:', failedTokens)
      }
      // Retorna informações da resposta
      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses
      }
    } catch (error) {
      console.error('Error sending multicast:', error.message)
      throw error
    }
  }

  /**
   * Envia notificação para um tópico
   * @param {string} topic - Nome do tópico
   * @param {object} notification - Objeto com title e body
   * @param {object} data - Dados adicionais
   */
  static async sendToTopic(topic, notification, data = {}) {
    if (!firebaseApp) {
      this.initialize()
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      topic: topic,
      android: {
        priority: 'high'
      }
    }

    try {
      const response = await admin.messaging().send(message)
      console.log('Topic notification sent:', response)
      return response
    } catch (error) {
      console.error('Error sending topic notification:', error.message)
      throw error
    }
  }

  /**
   * Inscreve um token em um tópico
   */
  static async subscribeToTopic(tokens, topic) {
    if (!firebaseApp) {
      this.initialize()
    }

    try {
      const response = await admin.messaging().subscribeToTopic(tokens, topic)
      console.log(`Subscribed to topic ${topic}:`, response)
      return response
    } catch (error) {
      console.error('Error subscribing to topic:', error.message)
      throw error
    }
  }

  /**
   * Remove inscrição de um tópico
   */
  static async unsubscribeFromTopic(tokens, topic) {
    if (!firebaseApp) {
      this.initialize()
    }

    try {
      const response = await admin.messaging().unsubscribeFromTopic(tokens, topic)
      console.log(`Unsubscribed from topic ${topic}:`, response)
      return response
    } catch (error) {
      console.error('Error unsubscribing from topic:', error.message)
      throw error
    }
  }
}

module.exports = FirebaseProvider
