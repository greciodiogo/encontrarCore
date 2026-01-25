'use strict'

const Firebase = require('../../../../config/firebase')
const Database = use('Database')

/**
 * Controller para testar notificações push
 * Útil para debug e validação do sistema de notificações
 */
class TestNotificationController {
  /**
   * Envia uma notificação de teste para o usuário autenticado
   * POST /api/notifications/test/send-to-me
   */
  async sendToMe({ response, auth }) {
    try {
      const user = await auth.getUser()

      // Buscar tokens do usuário
      const tokens = await Database
        .table('device_tokens')
        .where('user_id', user.id)
        .where('is_active', true)
        .select('token', 'device_name', 'device_type')

      if (!tokens || tokens.length === 0) {
        return response.status(404).json({
          success: false,
          message: 'Nenhum token FCM encontrado para este usuário',
          help: 'Certifique-se de que o app mobile registrou o token FCM'
        })
      }

      // Notificação de teste
      const notification = {
        title: '🔔 Notificação de Teste',
        body: `Olá ${user.name || 'Usuário'}! Esta é uma notificação de teste do Encontrar.`
      }

      const data = {
        type: 'test',
        timestamp: new Date().toISOString(),
        userId: user.id.toString()
      }

      const results = []

      // Enviar para cada token
      for (const deviceToken of tokens) {
        try {
          const result = await Firebase.sendNotification(
            deviceToken.token,
            notification,
            data
          )
          
          results.push({
            device: deviceToken.device_name,
            type: deviceToken.device_type,
            success: true,
            messageId: result
          })
        } catch (error) {
          results.push({
            device: deviceToken.device_name,
            type: deviceToken.device_type,
            success: false,
            error: error.message
          })
        }
      }

      const successCount = results.filter(r => r.success).length
      const failureCount = results.filter(r => !r.success).length

      return response.json({
        success: successCount > 0,
        message: `Notificação enviada para ${successCount} de ${tokens.length} dispositivo(s)`,
        summary: {
          total: tokens.length,
          success: successCount,
          failed: failureCount
        },
        results: results
      })

    } catch (error) {
      console.error('Error sending test notification:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao enviar notificação de teste',
        error: error.message
      })
    }
  }

  /**
   * Envia notificação de teste para um token específico
   * POST /api/notifications/test/send-to-token
   * Body: { token: "fcm-token-here", title: "Título", body: "Mensagem" }
   */
  async sendToToken({ request, response }) {
    try {
      const { token, title, body } = request.all()

      if (!token) {
        return response.status(400).json({
          success: false,
          message: 'Token FCM é obrigatório',
          example: {
            token: 'seu-fcm-token-aqui',
            title: 'Título da notificação (opcional)',
            body: 'Corpo da notificação (opcional)'
          }
        })
      }

      const notification = {
        title: title || '🔔 Teste de Notificação',
        body: body || 'Esta é uma notificação de teste enviada diretamente para o token.'
      }

      const data = {
        type: 'test_direct',
        timestamp: new Date().toISOString()
      }

      const result = await Firebase.sendNotification(token, notification, data)

      return response.json({
        success: true,
        message: 'Notificação enviada com sucesso',
        messageId: result,
        sentTo: {
          token: `${token.substring(0, 20)}...`,
          notification: notification
        }
      })

    } catch (error) {
      console.error('Error sending notification to token:', error)
      
      // Diagnóstico detalhado
      let diagnosis = {}
      if (error.message && error.message.includes('SenderId mismatch')) {
        diagnosis = {
          issue: 'SenderId Mismatch',
          cause: 'O token foi gerado com um projeto Firebase diferente',
          solution: [
            '1. Verifique se o google-services.json no app mobile está correto',
            '2. Confirme que o FIREBASE_SERVICE_ACCOUNT no backend corresponde ao mesmo projeto',
            '3. Desinstale e reinstale o app mobile para gerar um novo token'
          ]
        }
      } else if (error.message && error.message.includes('registration-token-not-registered')) {
        diagnosis = {
          issue: 'Token Inválido ou Expirado',
          cause: 'O token não está mais registrado no Firebase',
          solution: [
            '1. O app pode ter sido desinstalado',
            '2. O token pode ter expirado',
            '3. Gere um novo token no app mobile'
          ]
        }
      }

      return response.status(500).json({
        success: false,
        message: 'Erro ao enviar notificação',
        error: error.message,
        diagnosis: diagnosis
      })
    }
  }

  /**
   * Verifica a configuração do Firebase
   * GET /api/notifications/test/check-config
   */
  async checkConfig({ response }) {
    try {
      const Env = use('Env')
      const serviceAccountJson = Env.get('FIREBASE_SERVICE_ACCOUNT')
      
      if (!serviceAccountJson) {
        return response.status(500).json({
          success: false,
          message: 'FIREBASE_SERVICE_ACCOUNT não está configurado no .env'
        })
      }

      const serviceAccount = JSON.parse(serviceAccountJson)

      return response.json({
        success: true,
        message: 'Configuração do Firebase está OK',
        config: {
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          hasPrivateKey: !!serviceAccount.private_key,
          privateKeyLength: serviceAccount.private_key ? serviceAccount.private_key.length : 0
        }
      })

    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao verificar configuração',
        error: error.message
      })
    }
  }

  /**
   * Lista todos os tokens registrados do usuário autenticado
   * GET /api/notifications/test/my-tokens
   */
  async myTokens({ response, auth }) {
    try {
      const user = await auth.getUser()

      const tokens = await Database
        .table('device_tokens')
        .where('user_id', user.id)
        .orderBy('created_at', 'desc')

      return response.json({
        success: true,
        message: `Encontrados ${tokens.length} token(s)`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        tokens: tokens.map(t => ({
          id: t.id,
          device_name: t.device_name,
          device_type: t.device_type,
          is_active: t.is_active,
          token_preview: `${t.token.substring(0, 30)}...`,
          full_token: t.token,
          created_at: t.created_at,
          updated_at: t.updated_at
        }))
      })

    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao listar tokens',
        error: error.message
      })
    }
  }

  /**
   * Envia notificação para todos os usuários (admin only)
   * POST /api/notifications/test/broadcast
   */
  async broadcast({ request, response, auth }) {
    try {
      const user = await auth.getUser()
      
      // Verificar se é admin
      if (user.role !== 'admin') {
        return response.status(403).json({
          success: false,
          message: 'Apenas administradores podem enviar broadcasts'
        })
      }

      const { title, body } = request.all()

      if (!title || !body) {
        return response.status(400).json({
          success: false,
          message: 'Título e corpo são obrigatórios',
          example: {
            title: 'Título da notificação',
            body: 'Mensagem da notificação'
          }
        })
      }

      // Buscar todos os tokens ativos
      const tokens = await Database
        .table('device_tokens')
        .where('is_active', true)
        .select('token')

      if (!tokens || tokens.length === 0) {
        return response.status(404).json({
          success: false,
          message: 'Nenhum token ativo encontrado'
        })
      }

      const tokenList = tokens.map(t => t.token)

      const notification = { title, body }
      const data = {
        type: 'broadcast',
        timestamp: new Date().toISOString()
      }

      const result = await Firebase.sendMulticast(tokenList, notification, data)

      return response.json({
        success: true,
        message: 'Broadcast enviado',
        summary: {
          total: tokenList.length,
          success: result.successCount,
          failed: result.failureCount
        }
      })

    } catch (error) {
      console.error('Error sending broadcast:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao enviar broadcast',
        error: error.message
      })
    }
  }
}

module.exports = TestNotificationController
