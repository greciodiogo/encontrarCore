'use strict'

const Database = use('Database')

class DeliverySettingsController {
  
  /**
   * Listar todas as configurações de entrega
   * GET /api/delivery/settings
   */
  async index({ response }) {
    try {
      const settings = await Database
        .select('key', 'value', 'type', 'description')
        .from('delivery_settings')
        .orderBy('key', 'asc')
      
      // Converter valores para tipos corretos
      const formattedSettings = settings.map(setting => {
        let value = setting.value
        
        if (setting.type === 'number') {
          value = parseFloat(value)
        } else if (setting.type === 'boolean') {
          value = value === 'true' || value === '1'
        } else if (setting.type === 'json') {
          try {
            value = JSON.parse(value)
          } catch (e) {
            // Manter como string se não for JSON válido
          }
        }
        
        return {
          key: setting.key,
          value: value,
          type: setting.type,
          description: setting.description
        }
      })
      
      return response.json({
        success: true,
        data: formattedSettings
      })
    } catch (error) {
      console.error('[DELIVERY SETTINGS] Erro ao listar configurações:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao listar configurações',
        error: error.message
      })
    }
  }
  
  /**
   * Buscar uma configuração específica
   * GET /api/delivery/settings/:key
   */
  async show({ params, response }) {
    try {
      const setting = await Database
        .select('key', 'value', 'type', 'description')
        .from('delivery_settings')
        .where('key', params.key)
        .first()
      
      if (!setting) {
        return response.status(404).json({
          success: false,
          message: 'Configuração não encontrada'
        })
      }
      
      // Converter valor para tipo correto
      let value = setting.value
      if (setting.type === 'number') {
        value = parseFloat(value)
      } else if (setting.type === 'boolean') {
        value = value === 'true' || value === '1'
      } else if (setting.type === 'json') {
        try {
          value = JSON.parse(value)
        } catch (e) {
          // Manter como string
        }
      }
      
      return response.json({
        success: true,
        data: {
          key: setting.key,
          value: value,
          type: setting.type,
          description: setting.description
        }
      })
    } catch (error) {
      console.error('[DELIVERY SETTINGS] Erro ao buscar configuração:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar configuração',
        error: error.message
      })
    }
  }
  
  /**
   * Atualizar uma configuração
   * PUT /api/delivery/settings/:key
   * 
   * Body: { "value": "novo_valor" }
   */
  async update({ params, request, response }) {
    try {
      const { value } = request.only(['value'])
      
      if (value === undefined || value === null) {
        return response.status(400).json({
          success: false,
          message: 'O campo "value" é obrigatório'
        })
      }
      
      // Verificar se configuração existe
      const setting = await Database
        .select('key', 'type')
        .from('delivery_settings')
        .where('key', params.key)
        .first()
      
      if (!setting) {
        return response.status(404).json({
          success: false,
          message: 'Configuração não encontrada'
        })
      }
      
      // Validar tipo
      let stringValue = String(value)
      
      if (setting.type === 'number') {
        const numValue = parseFloat(value)
        if (isNaN(numValue)) {
          return response.status(400).json({
            success: false,
            message: 'Valor deve ser um número'
          })
        }
        stringValue = String(numValue)
      } else if (setting.type === 'boolean') {
        const boolValue = value === true || value === 'true' || value === '1' || value === 1
        stringValue = boolValue ? 'true' : 'false'
      } else if (setting.type === 'json') {
        try {
          stringValue = JSON.stringify(value)
        } catch (e) {
          return response.status(400).json({
            success: false,
            message: 'Valor deve ser um JSON válido'
          })
        }
      }
      
      // Atualizar configuração
      await Database
        .table('delivery_settings')
        .where('key', params.key)
        .update({
          value: stringValue,
          updated_at: new Date()
        })
      
      console.log(`[DELIVERY SETTINGS] Configuração atualizada: ${params.key} = ${stringValue}`)
      
      return response.json({
        success: true,
        message: 'Configuração atualizada com sucesso',
        data: {
          key: params.key,
          value: value
        }
      })
    } catch (error) {
      console.error('[DELIVERY SETTINGS] Erro ao atualizar configuração:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao atualizar configuração',
        error: error.message
      })
    }
  }
}

module.exports = DeliverySettingsController
