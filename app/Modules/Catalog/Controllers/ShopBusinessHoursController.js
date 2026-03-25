'use strict'

const ShopBusinessHoursService = use('App/Modules/Catalog/Services/ShopBusinessHoursService')
const { validate } = use('Validator')

/**
 * Controller para gerenciar horários de funcionamento das lojas
 */
class ShopBusinessHoursController {
  /**
   * Listar horários de funcionamento de uma loja
   * GET /api/shops/:id/business-hours
   */
  async index({ params, response }) {
    try {
      const shopId = params.id
      const businessHours = await new ShopBusinessHoursService().getBusinessHours(shopId)
      return response.ok(businessHours)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Criar horários de funcionamento para uma loja
   * POST /api/shops/:id/business-hours
   * 
   * Body: {
   *   business_hours: [
   *     { day_of_week: 1, open_time: "08:00", close_time: "12:00" },
   *     { day_of_week: 1, open_time: "14:00", close_time: "18:00" }
   *   ]
   * }
   */
  async store({ params, request, response }) {
    try {
      const shopId = params.id
      
      // Validação
      const validation = await validate(request.all(), {
        'business_hours': 'required|array',
        'business_hours.*.day_of_week': 'required|integer',
        'business_hours.*.open_time': 'required',
        'business_hours.*.close_time': 'required'
      })

      if (validation.fails()) {
        return response.badRequest({ 
          message: 'Erro de validação',
          errors: validation.messages()
        })
      }

      const { business_hours } = request.only(['business_hours'])

      if (!business_hours || !Array.isArray(business_hours)) {
        return response.badRequest({ 
          message: 'Campo business_hours é obrigatório e deve ser um array' 
        })
      }

      const createdHours = await new ShopBusinessHoursService()
        .createBusinessHours(shopId, business_hours)

      return response.created(createdHours, { 
        message: 'Horários de funcionamento criados com sucesso' 
      })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Atualizar horário de funcionamento específico
   * PUT /api/shops/:shopId/business-hours/:id
   */
  async update({ params, request, response }) {
    try {
      const hourId = params.id
      const updateData = request.only(['day_of_week', 'open_time', 'close_time', 'is_active'])

      const updatedHour = await new ShopBusinessHoursService()
        .updateBusinessHour(hourId, updateData)

      return response.ok(updatedHour, { 
        message: 'Horário atualizado com sucesso' 
      })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Deletar horário de funcionamento específico
   * DELETE /api/shops/:shopId/business-hours/:id
   */
  async destroy({ params, response }) {
    try {
      const hourId = params.id
      await new ShopBusinessHoursService().deleteBusinessHour(hourId)

      return response.ok(null, { 
        message: 'Horário deletado com sucesso' 
      })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Deletar todos os horários de uma loja
   * DELETE /api/shops/:id/business-hours
   */
  async destroyAll({ params, response }) {
    try {
      const shopId = params.id
      const deletedCount = await new ShopBusinessHoursService()
        .deleteAllBusinessHours(shopId)

      return response.ok({ deleted_count: deletedCount }, { 
        message: `${deletedCount} horário(s) deletado(s) com sucesso` 
      })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}

module.exports = ShopBusinessHoursController
