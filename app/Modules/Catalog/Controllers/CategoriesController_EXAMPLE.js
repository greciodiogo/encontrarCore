'use strict'

const Database = use('Database')
const TranslationHelper = use('App/Helpers/TranslationHelper')

/**
 * EXEMPLO de como usar traduções no controller
 * 
 * Este é um arquivo de exemplo. Adapte para seus controllers existentes.
 */
class CategoriesController {
  /**
   * Listar todas as categorias (com tradução)
   */
  async index({ request, response }) {
    try {
      // Obter locale do request (configurado pelo LocaleMiddleware)
      const locale = request.locale || 'pt'
      
      // Opção 1: Usar SQL com COALESCE (recomendado)
      const categories = await Database
        .select(
          'id',
          'slug',
          'icon',
          'parent_category_id',
          Database.raw(TranslationHelper.getSelectSQL('name', locale)),
          Database.raw(TranslationHelper.getSelectSQL('description', locale))
        )
        .from('categories')
        .where('deleted_at', null)
        .orderBy('name')
      
      return response.json({
        success: true,
        data: categories,
        locale: locale
      })
      
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar categorias',
        error: error.message
      })
    }
  }

  /**
   * Buscar categoria por ID (com tradução)
   */
  async show({ params, request, response }) {
    try {
      const locale = request.locale || 'pt'
      
      const category = await Database
        .select(
          'id',
          'slug',
          'icon',
          'parent_category_id',
          Database.raw(TranslationHelper.getSelectSQL('name', locale)),
          Database.raw(TranslationHelper.getSelectSQL('description', locale))
        )
        .from('categories')
        .where('id', params.id)
        .where('deleted_at', null)
        .first()
      
      if (!category) {
        return response.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        })
      }
      
      return response.json({
        success: true,
        data: category,
        locale: locale
      })
      
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar categoria',
        error: error.message
      })
    }
  }

  /**
   * Opção 2: Buscar todos os campos e traduzir no código
   */
  async indexAlternative({ request, response }) {
    try {
      const locale = request.locale || 'pt'
      
      // Buscar todos os campos
      const categories = await Database
        .select('*')
        .from('categories')
        .where('deleted_at', null)
        .orderBy('name')
      
      // Traduzir usando helper
      const translated = TranslationHelper.translateArray(
        categories,
        ['name', 'description'],
        locale
      )
      
      // Limpar campos de tradução da resposta
      const cleaned = translated.map(cat => 
        TranslationHelper.cleanTranslationFields(cat, ['name', 'description'])
      )
      
      return response.json({
        success: true,
        data: cleaned,
        locale: locale
      })
      
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar categorias',
        error: error.message
      })
    }
  }

  /**
   * Buscar produtos de uma categoria (com tradução)
   */
  async products({ params, request, response }) {
    try {
      const locale = request.locale || 'pt'
      
      const products = await Database
        .select(
          'p.id',
          'p.slug',
          'p.price',
          'p.stock',
          'p.image',
          Database.raw(TranslationHelper.getSelectSQL('p.name', locale, 'name')),
          Database.raw(TranslationHelper.getSelectSQL('p.description', locale, 'description'))
        )
        .from('products as p')
        .join('categories_products as cp', 'p.id', 'cp.product_id')
        .where('cp.category_id', params.id)
        .where('p.deleted_at', null)
        .orderBy('p.name')
      
      return response.json({
        success: true,
        data: products,
        locale: locale
      })
      
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar produtos',
        error: error.message
      })
    }
  }
}

module.exports = CategoriesController
