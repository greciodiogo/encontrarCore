'use strict'

const SplashScreenService = use('App/Modules/Utilitarios/Services/SplashScreenService')

class SplashScreenController {
  constructor() {
    this.service = new SplashScreenService()
  }

  /**
   * Listar todos os splash screens (Admin)
   * GET /api/splash-screens
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
      console.error('Erro ao listar splash screens:', error)
      return response.internalServer(null, {
        message: 'Erro ao listar splash screens'
      })
    }
  }

  /**
   * Listar splash screens ativos (Mobile App)
   * GET /api/splash-screens/active
   */
  async active({ response }) {
    try {
      const data = await this.service.findAllActive()
      return response.ok(data)
    } catch (error) {
      console.error('Erro ao buscar splash screens ativos:', error)
      return response.internalServer(null, {
        message: 'Erro ao buscar splash screens'
      })
    }
  }

  /**
   * Buscar splash screen por ID
   * GET /api/splash-screens/:id
   */
  async show({ params, response }) {
    try {
      const data = await this.service.findById(params.id)
      return response.ok(data)
    } catch (error) {
      console.error('Erro ao buscar splash screen:', error)
      return response.notFound(null, {
        message: error.message || 'Splash screen não encontrado'
      })
    }
  }

  /**
   * Criar novo splash screen
   * POST /api/splash-screens
   */
  async store({ request, response }) {
    try {
      const data = request.only([
        'title',
        'description',
        'order',
        'duration',
        'is_active'
      ])

      const file = request.file('image', {
        types: ['image'],
        size: '5mb'
      })

      const splashScreen = await this.service.create(data, file)

      return response.created(splashScreen, {
        message: 'Splash screen criado com sucesso'
      })
    } catch (error) {
      console.error('Erro ao criar splash screen:', error)
      return response.badRequest(null, {
        message: error.message || 'Erro ao criar splash screen'
      })
    }
  }

  /**
   * Atualizar splash screen
   * PUT /api/splash-screens/:id
   */
  async update({ params, request, response }) {
    try {
      const data = request.only([
        'title',
        'description',
        'order',
        'duration',
        'is_active'
      ])

      const file = request.file('image', {
        types: ['image'],
        size: '5mb'
      })

      const splashScreen = await this.service.update(params.id, data, file)

      return response.ok(splashScreen, {
        message: 'Splash screen atualizado com sucesso'
      })
    } catch (error) {
      console.error('Erro ao atualizar splash screen:', error)
      return response.badRequest(null, {
        message: error.message || 'Erro ao atualizar splash screen'
      })
    }
  }

  /**
   * Deletar splash screen
   * DELETE /api/splash-screens/:id
   */
  async destroy({ params, response }) {
    try {
      await this.service.delete(params.id)
      return response.ok(null, {
        message: 'Splash screen deletado com sucesso'
      })
    } catch (error) {
      console.error('Erro ao deletar splash screen:', error)
      return response.badRequest(null, {
        message: error.message || 'Erro ao deletar splash screen'
      })
    }
  }

  /**
   * Ativar/Desativar splash screen
   * PATCH /api/splash-screens/:id/toggle
   */
  async toggle({ params, response }) {
    try {
      const splashScreen = await this.service.toggleActive(params.id)
      return response.ok(splashScreen, {
        message: `Splash screen ${splashScreen.is_active ? 'ativado' : 'desativado'} com sucesso`
      })
    } catch (error) {
      console.error('Erro ao alternar status:', error)
      return response.badRequest(null, {
        message: error.message || 'Erro ao alternar status'
      })
    }
  }

  /**
   * Reordenar splash screens
   * POST /api/splash-screens/reorder
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
        message: error.message || 'Erro ao reordenar splash screens'
      })
    }
  }
}

module.exports = SplashScreenController
