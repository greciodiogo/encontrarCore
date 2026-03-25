'use strict'

const ShopStatus = use('App/Modules/Catalog/Constants/ShopStatus')
const ShopBusinessHoursRepository = use('App/Modules/Catalog/Repositories/ShopBusinessHoursRepository')
const ShopRepository = use('App/Modules/Catalog/Repositories/ShopRepository')
const Database = use('Database')

class ShopStatusService {
  constructor() {}

  /**
   * Calcula o status atual da loja baseado nos horários de funcionamento
   * @param {Object} shop - Objeto da loja
   * @returns {String} - Status atual (OPEN, CLOSED, PAUSED, MANUALLY_CLOSED)
   */
  async getCurrentStatus(shop) {
    // Se há override manual, retorna o status definido manualmente
    if (shop.is_manual_override && shop.status) {
      return shop.status
    }

    // Calcula status baseado no horário de funcionamento
    const now = new Date()
    const currentDay = now.getDay() // 0-6 (Domingo-Sábado)
    const currentTime = this._formatTime(now)

    // Busca horários do dia atual
    const businessHours = await new ShopBusinessHoursRepository()
      .findByShopAndDay(shop.id, currentDay)
      .fetch()

    if (!businessHours || businessHours.rows.length === 0) {
      return ShopStatus.CLOSED
    }

    // Verifica se está em algum período ativo
    const isInActivePeriod = businessHours.rows.some(period => {
      return currentTime >= period.open_time && currentTime < period.close_time
    })

    return isInActivePeriod ? ShopStatus.OPEN : ShopStatus.CLOSED
  }

  /**
   * Define status manual da loja (override)
   * @param {Number} shopId - ID da loja
   * @param {String} status - Novo status (PAUSED, MANUALLY_CLOSED)
   * @returns {Object} - Loja atualizada
   */
  async setManualStatus(shopId, status) {
    const validManualStatuses = [ShopStatus.PAUSED, ShopStatus.MANUALLY_CLOSED]
    
    if (!validManualStatuses.includes(status)) {
      throw new Error(`Status inválido. Use: ${validManualStatuses.join(', ')}`)
    }

    return await new ShopRepository().update(shopId, {
      status: status,
      is_manual_override: true,
      last_status_change: new Date()
    })
  }

  /**
   * Remove override manual e volta ao status automático
   * @param {Number} shopId - ID da loja
   * @returns {Object} - Loja atualizada
   */
  async removeManualOverride(shopId) {
    return await new ShopRepository().update(shopId, {
      status: null,
      is_manual_override: false,
      last_status_change: new Date()
    })
  }

  /**
   * Obtém informações completas de status da loja
   * @param {Number} shopId - ID da loja
   * @returns {Object} - Informações de status
   */
  async getShopStatusInfo(shopId) {
    const shop = await new ShopRepository().findById(shopId).first()
    
    if (!shop) {
      throw new Error('Loja não encontrada')
    }

    const currentStatus = await this.getCurrentStatus(shop)
    const businessHours = await new ShopBusinessHoursRepository()
      .findByShopId(shopId)
      .orderBy('day_of_week', 'asc')
      .orderBy('open_time', 'asc')
      .fetch()

    return {
      shop_id: shop.id,
      shop_name: shop.shopName,
      current_status: currentStatus,
      is_manual_override: shop.is_manual_override,
      last_status_change: shop.last_status_change,
      business_hours: businessHours.toJSON()
    }
  }

  /**
   * Formata hora no formato HH:MM
   * @param {Date} date - Data
   * @returns {String} - Hora formatada
   */
  _formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  /**
   * Valida formato de hora HH:MM
   * @param {String} time - Hora no formato HH:MM
   * @returns {Boolean}
   */
  _isValidTimeFormat(time) {
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/
    return timeRegex.test(time)
  }
}

module.exports = ShopStatusService
