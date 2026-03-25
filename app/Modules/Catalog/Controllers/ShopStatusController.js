'use strict'

const ShopStatusService = use('App/Modules/Catalog/Services/ShopStatusService')

/**
 * Controller para gerenciar status das lojas
 */
class ShopStatusController {
  /**
   * Obter status atual da loja
   * GET /api/shops/:id/status
   */
  async show({ params, response }) {
    try {
      const shopId = params.id
      const statusInfo = await new ShopStatusService().getShopStatusInfo(shopId)
      return response.ok(statusInfo)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Definir status manual da loja (pausar ou fechar manualmente)
   * POST /api/shops/:id/status
   * 
   * Body: { status: "PAUSED" | "MANUALLY_CLOSED" }
   */
  async update({ params, request, response }) {
    try {
      const shopId = params.id
      const { status } = request.only(['status'])

      if (!status) {
        return response.badRequest({ message: 'Campo status é obrigatório' })
      }

      await new ShopStatusService().setManualStatus(shopId, status)
      const statusInfo = await new ShopStatusService().getShopStatusInfo(shopId)

      return response.ok(statusInfo, { 
        message: 'Status da loja atualizado com sucesso' 
      })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Remover override manual e voltar ao status automático
   * DELETE /api/shops/:id/status
   */
  async destroy({ params, response }) {
    try {
      const shopId = params.id
      await new ShopStatusService().removeManualOverride(shopId)
      const statusInfo = await new ShopStatusService().getShopStatusInfo(shopId)

      return response.ok(statusInfo, { 
        message: 'Status manual removido. Loja voltou ao modo automático' 
      })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}

module.exports = ShopStatusController
