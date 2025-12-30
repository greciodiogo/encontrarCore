'use strict'

const Model = use('Model')

class DeviceToken extends Model {
  static boot() {
    super.boot()
  }

  static get table() {
    return 'device_tokens'
  }

  // Relacionamentos
  user() {
    return this.belongsTo('App/Models/User')
  }

  static get fillable() {
    return ['user_id', 'token', 'device_name', 'device_type', 'is_active']
  }

  static get hidden() {
    return []
  }

  static get dates() {
    return ['created_at', 'updated_at']
  }

  /**
   * Registra ou atualiza um token de dispositivo
   */
  static async registerToken(userId, token, deviceName, deviceType = 'mobile') {
    try {
      // Verifica se o token já existe para este usuário
      let deviceToken = await this.where('user_id', userId)
        .where('token', token)
        .first()

      if (deviceToken) {
        // Atualiza o token existente
        deviceToken.device_name = deviceName
        deviceToken.device_type = deviceType
        deviceToken.is_active = true
        await deviceToken.save()
        return deviceToken
      }

      // Cria novo token
      deviceToken = await this.create({
        user_id: userId,
        token: token,
        device_name: deviceName,
        device_type: deviceType,
        is_active: true
      })

      return deviceToken
    } catch (error) {
      console.error('Error registering device token:', error.message)
      throw error
    }
  }

  /**
   * Desativa um token de dispositivo
   */
  static async deactivateToken(token) {
    try {
      const deviceToken = await this.where('token', token).first()
      if (deviceToken) {
        deviceToken.is_active = false
        await deviceToken.save()
      }
      return deviceToken
    } catch (error) {
      console.error('Error deactivating device token:', error.message)
      throw error
    }
  }

  /**
   * Remove um token de dispositivo
   */
  static async removeToken(token) {
    try {
      await this.where('token', token).delete()
    } catch (error) {
      console.error('Error removing device token:', error.message)
      throw error
    }
  }

  /**
   * Obtém todos os tokens ativos de um usuário
   */
  static async getActiveTokens(userId) {
    try {
      const tokens = await this.where('user_id', userId)
        .where('is_active', true)
        .fetch()

      return tokens.rows.map(t => t.token)
    } catch (error) {
      console.error('Error getting active tokens:', error.message)
      throw error
    }
  }
}

module.exports = DeviceToken
