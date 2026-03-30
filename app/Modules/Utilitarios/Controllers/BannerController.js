'use strict'

const BannerService = use('App/Modules/Utilitarios/Services/BannerService')

class BannerController {
  constructor() {
    this.service = new BannerService()
  }

  /**
   * Listar todos os banners (Admin)
   * GET /api/banners
   */
  async index({ request, response }) {
    try {
      const filters = {
        page: request.input('page'),
        perPage: request.input('perPage'),
        search: request.input('search'),
        is_active: request.input('is_active'),
        orderBy: request.input('orderBy'),
        typeOrderBy: request.input('typeOrderBy'),
        isPaginate: request.input('isPaginate', true)
      }

      const data = await this.service.findAll(filters)
      return response.ok(data)
    } catch (error) {
      console.error('Erro ao listar banners:', error)
      return response.internalServer(null, {
        message: 'Erro ao listar banners'
      })
    }
  }

  /**
   * Listar banners ativos (Mobile App e Website)
   * GET /api/banners/active
   */
  async active({ response }) {
    try {
      const data = await this.service.findAllActive()
      return response.ok(data)
    } catch (error) {
      console.error('Erro ao buscar banners ativos:', error)
      return response.internalServer(null, {
        message: 'Erro ao buscar banners'
      })
    }
  }

  /**
   * Buscar banner por ID
   * GET /api/banners/:id
   */
  async show({ params, response }) {
    try {
      const data = await this.service.findById(params.id)
      return response.ok(data)
    } catch (error) {
      console.error('Erro ao buscar banner:', error)
      return response.notFound(null, {
        message: error.message || 'Banner não encontrado'
      })
    }
  }

  /**
   * Criar novo banner
   * POST /api/banners
   */
  async store({ request, response }) {
    try {
      const data = request.only([
        'title',
        'description',
        'link_url',
        'order',
        'is_active'
      ])

      const filePt = request.file('image_pt', {
        types: ['image'],
        size: '5mb'
      })

      const fileEn = request.file('image_en', {
        types: ['image'],
        size: '5mb'
      })

      const banner = await this.service.create(data, filePt, fileEn)

      return response.created(banner, {
        message: 'Banner criado com sucesso'
      })
    } catch (error) {
      console.error('Erro ao criar banner:', error)
      return response.badRequest(null, {
        message: error.message || 'Erro ao criar banner'
      })
    }
  }

  /**
   * Atualizar banner
   * PUT /api/banners/:id
   */
  async update({ params, request, response }) {
    try {
      const data = request.only([
        'title',
        'description',
        'link_url',
        'order',
        'is_active'
      ])

      const filePt = request.file('image_pt', {
        types: ['image'],
        size: '5mb'
      })

      const fileEn = request.file('image_en', {
        types: ['image'],
        size: '5mb'
      })

      const banner = await this.service.update(params.id, data, filePt, fileEn)

      return response.ok(banner, {
        message: 'Banner atualizado com sucesso'
      })
    } catch (error) {
      console.error('Erro ao atualizar banner:', error)
      return response.badRequest(null, {
        message: error.message || 'Erro ao atualizar banner'
      })
    }
  }

  /**
   * Deletar banner
   * DELETE /api/banners/:id
   */
  async destroy({ params, response }) {
    try {
      await this.service.delete(params.id)
      return response.ok(null, {
        message: 'Banner deletado com sucesso'
      })
    } catch (error) {
      console.error('Erro ao deletar banner:', error)
      return response.badRequest(null, {
        message: error.message || 'Erro ao deletar banner'
      })
    }
  }

  /**
   * Ativar/Desativar banner
   * PATCH /api/banners/:id/toggle
   */
  async toggle({ params, response }) {
    try {
      const banner = await this.service.toggleActive(params.id)
      return response.ok(banner, {
        message: `Banner ${banner.is_active ? 'ativado' : 'desativado'} com sucesso`
      })
    } catch (error) {
      console.error('Erro ao alternar status:', error)
      return response.badRequest(null, {
        message: error.message || 'Erro ao alternar status'
      })
    }
  }

  /**
   * Reordenar banners
   * POST /api/banners/reorder
   */
  async reorder({ request, response }) {
    try {
      const items = request.input('items', [])
      
      if (!Array.isArray(items) || items.length === 0) {
        return response.badRequest(null, {
          message: 'Lista de itens inválida'
        })
      }

      await this.service.reorder(items)

      return response.ok(null, {
        message: 'Ordem atualizada com sucesso'
      })
    } catch (error) {
      console.error('Erro ao reordenar:', error)
      return response.badRequest(null, {
        message: error.message || 'Erro ao reordenar banners'
      })
    }
  }
}

module.exports = BannerController
