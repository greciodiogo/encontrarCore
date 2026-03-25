'use strict'

const ShopBusinessHoursRepository = use('App/Modules/Catalog/Repositories/ShopBusinessHoursRepository')
const ShopRepository = use('App/Modules/Catalog/Repositories/ShopRepository')

class ShopBusinessHoursService {
  constructor() {}

  /**
   * Criar múltiplos horários de funcionamento para uma loja
   * @param {Number} shopId - ID da loja
   * @param {Array} businessHoursData - Array de horários
   * @returns {Array} - Horários criados
   */
  async createBusinessHours(shopId, businessHoursData) {
    // Verifica se a loja existe
    const shop = await new ShopRepository().findById(shopId).first()
    if (!shop) {
      throw new Error('Loja não encontrada')
    }

    // Valida e cria os horários
    const createdHours = []
    for (const hourData of businessHoursData) {
      this._validateBusinessHour(hourData)
      
      const businessHour = await new ShopBusinessHoursRepository().create({
        shop_id: shopId,
        day_of_week: hourData.day_of_week,
        open_time: hourData.open_time,
        close_time: hourData.close_time,
        is_active: hourData.is_active !== undefined ? hourData.is_active : true
      })
      
      createdHours.push(businessHour)
    }

    return createdHours
  }

  /**
   * Listar horários de funcionamento de uma loja
   * @param {Number} shopId - ID da loja
   * @returns {Array} - Horários da loja
   */
  async getBusinessHours(shopId) {
    const businessHours = await new ShopBusinessHoursRepository()
      .findByShopId(shopId)
      .orderBy('day_of_week', 'asc')
      .orderBy('open_time', 'asc')
      .fetch()

    return businessHours.toJSON()
  }

  /**
   * Atualizar horário de funcionamento
   * @param {Number} hourId - ID do horário
   * @param {Object} updateData - Dados para atualizar
   * @returns {Object} - Horário atualizado
   */
  async updateBusinessHour(hourId, updateData) {
    if (updateData.open_time || updateData.close_time) {
      this._validateBusinessHour({
        open_time: updateData.open_time,
        close_time: updateData.close_time
      })
    }

    return await new ShopBusinessHoursRepository().update(hourId, updateData)
  }

  /**
   * Deletar horário de funcionamento
   * @param {Number} hourId - ID do horário
   * @returns {Boolean}
   */
  async deleteBusinessHour(hourId) {
    return await new ShopBusinessHoursRepository().delete(hourId)
  }

  /**
   * Deletar todos os horários de uma loja
   * @param {Number} shopId - ID da loja
   * @returns {Number} - Quantidade de horários deletados
   */
  async deleteAllBusinessHours(shopId) {
    const Database = use('Database')
    return await Database.table('shop_business_hours')
      .where('shop_id', shopId)
      .delete()
  }

  /**
   * Valida dados de horário de funcionamento
   * @param {Object} hourData - Dados do horário
   */
  _validateBusinessHour(hourData) {
    // Valida dia da semana
    if (hourData.day_of_week !== undefined) {
      if (hourData.day_of_week < 0 || hourData.day_of_week > 6) {
        throw new Error('day_of_week deve estar entre 0 (Domingo) e 6 (Sábado)')
      }
    }

    // Valida formato de hora
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/
    
    if (hourData.open_time && !timeRegex.test(hourData.open_time)) {
      throw new Error('open_time deve estar no formato HH:MM (ex: 08:00)')
    }

    if (hourData.close_time && !timeRegex.test(hourData.close_time)) {
      throw new Error('close_time deve estar no formato HH:MM (ex: 17:00)')
    }

    // Valida se hora de abertura é antes da hora de fechamento
    if (hourData.open_time && hourData.close_time) {
      if (hourData.open_time >= hourData.close_time) {
        throw new Error('open_time deve ser anterior a close_time')
      }
    }
  }
}

module.exports = ShopBusinessHoursService
