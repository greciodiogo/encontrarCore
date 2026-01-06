'use strict'
const DeviceTokenService = use('App/Modules/Authentication/Services/DeviceTokenService')
class DeviceTokenController {
  constructor() {}
  /**
   * Registra ou atualiza um token de dispositivo para notificações push
   * POST /device-token/register
   */
  async register({ request, response, auth }) {
    try {
      const { token, device_name, device_type } = request.all()

      // Validar dados obrigatórios
      if (!token) {
        return response.status(400).json({
          message: 'FCM token é obrigatório'
        })
      }

      const user = await auth.getUser()

      // Registrar ou atualizar token
      const deviceToken = await new DeviceTokenService().registerToken(
        user.id,
        token,
        device_name || `Device-${new Date().getTime()}`,
        device_type || 'mobile'
      )

      return response.status(201).json({
        message: 'Token registrado com sucesso',
        data: {
          id: deviceToken.id,
          token: deviceToken.token,
          device_name: deviceToken.device_name,
          device_type: deviceToken.device_type
        }
      })
    } catch (error) {
      console.error('Error registering device token:', error.message)
      return response.status(500).json({
        message: 'Erro ao registrar token',
        error: error.message
      })
    }
  }

  /**
   * Remove um token de dispositivo
   * POST /device-token/unregister
   */
  async unregister({ request, response, auth }) {
    try {
      const { token } = request.all()

      if (!token) {
        return response.status(400).json({
          message: 'FCM token é obrigatório'
        })
      }

      const user = await auth.getUser()

      // Deativa o token
      await new DeviceTokenService().deactivateToken(token)

      return response.json({
        message: 'Token removido com sucesso'
      })
    } catch (error) {
      console.error('Error unregistering device token:', error.message)
      return response.status(500).json({
        message: 'Erro ao remover token',
        error: error.message
      })
    }
  }

  /**
   * Lista todos os tokens do usuário autenticado
   * GET /device-token/list
   */
  async list({ response, auth }) {
    try {
      const user = await auth.getUser()

      const tokens = await new DeviceTokenService().findDeviceTokenUserIdAndActived(user.id, true);
      return response.json({
        message: 'Tokens listados com sucesso',
        data: tokens.rows.map(token => ({
          id: token.id,
          token: token.token,
          device_name: token.device_name,
          device_type: token.device_type,
          created_at: token.created_at
        }))
      })
    } catch (error) {
      console.error('Error listing device tokens:', error.message)
      return response.status(500).json({
        message: 'Erro ao listar tokens',
        error: error.message
      })
    }
  }

  /**
   * Obtém informações de um token específico
   * GET /device-token/:id
   */
  async show({ params, response, auth }) {
    try {
      const user = await auth.getUser()
      const token = await new DeviceTokenService().findDeviceTokenById(params.id)

      if (!token || token.user_id !== user.id) {
        return response.status(404).json({
          message: 'Token não encontrado'
        })
      }

      return response.json({
        data: {
          id: token.id,
          token: token.token,
          device_name: token.device_name,
          device_type: token.device_type,
          is_active: token.is_active,
          created_at: token.created_at,
          updated_at: token.updated_at
        }
      })
    } catch (error) {
      console.error('Error getting device token:', error.message)
      return response.status(500).json({
        message: 'Erro ao obter token',
        error: error.message
      })
    }
  }

  /**
   * Remove todos os tokens de um dispositivo
   * DELETE /device-token/delete-all
   */
  async deleteAll({ response, auth }) {
    try {
      const user = await auth.getUser()

      await new DeviceTokenService().where('user_id', user.id).delete()

      return response.json({
        message: 'Todos os tokens foram removidos'
      })
    } catch (error) {
      console.error('Error deleting all device tokens:', error.message)
      return response.status(500).json({
        message: 'Erro ao remover tokens',
        error: error.message
      })
    }
  }
}

module.exports = DeviceTokenController
