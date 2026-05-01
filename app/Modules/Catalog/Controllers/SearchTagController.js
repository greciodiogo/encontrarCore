'use strict'

const SearchTag = use('App/Modules/Catalog/Models/SearchTag')

class SearchTagController {
  /**
   * Listar tags ativas para o mobile app
   * GET /api/search-tags
   */
  async index({ response }) {
    try {
      const tags = await SearchTag.query()
        .where('active', true)
        .orderBy('order', 'asc')
        .orderBy('click_count', 'desc')
        .select('id', 'tag', 'icon', 'color')
        .fetch()

      return response.json({
        success: true,
        data: tags
      })
    } catch (error) {
      console.error('Erro ao buscar search tags:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar tags de pesquisa',
        error: error.message
      })
    }
  }

  /**
   * Incrementar contador de cliques
   * POST /api/search-tags/:id/click
   */
  async incrementClick({ params, response }) {
    try {
      const tag = await SearchTag.find(params.id)

      if (!tag) {
        return response.status(404).json({
          success: false,
          message: 'Tag não encontrada'
        })
      }

      tag.click_count = tag.click_count + 1
      await tag.save()

      return response.json({
        success: true,
        message: 'Contador atualizado',
        data: {
          id: tag.id,
          click_count: tag.click_count
        }
      })
    } catch (error) {
      console.error('Erro ao incrementar contador:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao atualizar contador',
        error: error.message
      })
    }
  }
}

module.exports = SearchTagController
