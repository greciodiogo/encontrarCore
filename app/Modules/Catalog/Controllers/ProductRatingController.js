'use strict'

const ProductRatingService = use('App/Modules/Catalog/Services/ProductRatingService')

class ProductRatingController {
  
  /**
   * GET /api/products/:id/ratings
   * Buscar avaliações de um produto
   */
  async index({ params, response }) {
    try {
      const service = new ProductRatingService()
      const ratings = await service.getProductRatings(params.id)
      
      return response.status(200).json(ratings)
    } catch (error) {
      console.error('Error fetching ratings:', error)
      return response.status(500).json({
        message: 'Erro ao buscar avaliações',
        error: error.message
      })
    }
  }

  /**
   * GET /api/products/:id/ratings/average
   * Buscar média de rating de um produto
   */
  async average({ params, response }) {
    try {
      const service = new ProductRatingService()
      const average = await service.getProductAverageRating(params.id)
      
      return response.status(200).json(average)
    } catch (error) {
      console.error('Error calculating average:', error)
      return response.status(500).json({
        message: 'Erro ao calcular média',
        error: error.message
      })
    }
  }

  /**
   * POST /api/products/:id/ratings
   * Criar nova avaliação
   */
  async store({ params, request, auth, response }) {
    try {
      const data = request.only(['rating', 'comment'])
      const service = new ProductRatingService()
      const rating = await service.createRating(params.id, data, auth)
      
      return response.status(201).json({
        message: 'Avaliação criada com sucesso',
        data: rating
      })
    } catch (error) {
      console.error('Error creating rating:', error)
      return response.status(400).json({
        message: error.message
      })
    }
  }

  /**
   * PUT /api/ratings/:id
   * Atualizar avaliação
   */
  async update({ params, request, auth, response }) {
    try {
      const data = request.only(['rating', 'comment'])
      const service = new ProductRatingService()
      const rating = await service.updateRating(params.id, data, auth)
      
      return response.status(200).json({
        message: 'Avaliação atualizada com sucesso',
        data: rating
      })
    } catch (error) {
      console.error('Error updating rating:', error)
      return response.status(400).json({
        message: error.message
      })
    }
  }

  /**
   * DELETE /api/ratings/:id
   * Deletar avaliação
   */
  async destroy({ params, auth, response }) {
    try {
      const service = new ProductRatingService()
      const result = await service.deleteRating(params.id, auth)
      
      return response.status(200).json(result)
    } catch (error) {
      console.error('Error deleting rating:', error)
      return response.status(400).json({
        message: error.message
      })
    }
  }
}

module.exports = ProductRatingController
