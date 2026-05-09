'use strict'

const ProductPhotosService = use('App/Modules/Catalog/Services/ProductPhotosService')
const NotFoundException = use('App/Exceptions/NotFoundException')
const FileNotFoundException = use('App/Exceptions/FileNotFoundException')

class ProductPhotosController {
  constructor() {
    this.productPhotosService = new ProductPhotosService()
  }

  /**
   * Get all product photos with pagination and filters
   * GET /api/products/photos
   * 
   * @queryParam page Número da página
   * @queryParam perPage Itens por página
   * @queryParam search Termo de busca (busca em name e path)
   * @queryParam orderBy Campo para ordenação
   * @queryParam typeOrderBy Tipo de ordenação (ASC/DESC)
   * @queryParam product_id Filtrar por ID do produto
   * @queryParam is_primary Filtrar por foto principal (true/false)
   */
  async index({ request, response }) {
    try {
      const photos = await this.productPhotosService.getProductPhotos(request)
      return response.ok({
        status: 'success',
        data: photos.rows,
        meta: {
          total: photos.pages.total,
          per_page: parseInt(request.input('perPage', 10)),
          current_page: parseInt(request.input('page', 1)),
          last_page: Math.ceil(photos.pages.total / request.input('perPage', 10)),
          from: photos.pages.page,
          to: Math.min(photos.pages.total, photos.pages.page * request.input('perPage', 10))
        }
      })
    } catch (error) {
      return response.internalServerError({ 
        status: 'error',
        message: 'Erro ao buscar fotos de produtos',
        error: error.message 
      })
    }
  }

  /**
   * Resolve product image URL
   * GET /api/products/:productId/image-url
   * 
   * Returns the full URL for a product image:
   * - If product has photos in photos table, returns API URL
   * - If product has relative path, returns Supabase URL
   * - If no image, returns null
   */
  async resolveImageUrl({ params, response }) {
    try {
      const { productId } = params
      const Database = use('Database')
      
      // First, check if product has photos in photos table
      const photos = await Database
        .table('photos')
        .where('product_id', productId)
        .orderBy('is_primary', 'desc')
        .orderBy('id', 'asc')
        .limit(1)
      
      if (photos.length > 0) {
        const photoId = photos[0].id
        const apiUrl = `https://portal-api.encontrarshopping.com/api/products/${productId}/photos/${photoId}`
        return response.ok({
          status: 'success',
          data: {
            url: apiUrl,
            source: 'api',
            photoId: photoId
          }
        })
      }
      
      // If no photos in table, check if product has image path
      const product = await Database
        .table('products')
        .where('id', productId)
        .first()
      
      if (!product) {
        throw new NotFoundException('Produto não encontrado')
      }
      
      if (product.image && product.image.trim() !== '') {
        // If it's already a full URL, return it
        if (product.image.startsWith('http')) {
          return response.ok({
            status: 'success',
            data: {
              url: product.image,
              source: 'direct'
            }
          })
        }
        
        // If it's a relative path, construct Supabase URL
        const supabaseUrl = `https://opfiripapiqozvbopcdc.supabase.co/storage/v1/object/public/${product.image}`
        return response.ok({
          status: 'success',
          data: {
            url: supabaseUrl,
            source: 'supabase',
            originalPath: product.image
          }
        })
      }
      
      // No image available
      return response.ok({
        status: 'success',
        data: {
          url: null,
          source: 'none'
        }
      })
      
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.notFound({ 
          status: 'error',
          message: error.message 
        })
      }
      return response.internalServerError({ 
        status: 'error',
        message: 'Erro ao resolver URL da imagem',
        error: error.message 
      })
    }
  }

  /**
   * Get a specific product photo
   * GET /api/products/:productId/photos/:photoId
   * GET /api/products/:productId/photos/:photoId?thumbnail=true
   */
  async show({ params, request, response }) {
    try {
      const { productId, photoId } = params
      const thumbnail = request.input('thumbnail', false) === 'true' || request.input('thumbnail') === true

      const buffer = await this.productPhotosService.getProductPhoto(productId, photoId, thumbnail)
      // Set appropriate content type (default to jpeg if not available)
      response.header('Content-Type', 'image/jpeg')
      return buffer
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof FileNotFoundException) {
        return response.notFound({ message: error.message })
      }
      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * Get product photos sizes with pagination and filters
   * GET /api/products/photos/sizes
   * 
   * @queryParam page Número da página
   * @queryParam perPage Itens por página
   * @queryParam search Termo de busca (busca em name e path)
   * @queryParam orderBy Campo para ordenação (padrão: size)
   * @queryParam typeOrderBy Tipo de ordenação (ASC/DESC, padrão: DESC)
   * @queryParam min_size Tamanho mínimo em bytes
   * @queryParam max_size Tamanho máximo em bytes
   * @queryParam product_id Filtrar por ID do produto
   */
  async getSizes({ request, response }) {
    try {
      const result = await this.productPhotosService.getProductPhotosSizes(request);
      
      return response.ok({
        status: 'success',
        data: result.data,
        meta: result.pagination
      });
    } catch (error) {
      return response.internalServerError({ 
        status: 'error',
        message: 'Erro ao buscar tamanhos de fotos de produtos',
        error: error.message 
      });
    }
  }

  /**
   * Add photo to product
   * POST /api/products/:productId/photos
   */
  async store({ params, request, response }) {
    try {
      const { productId } = params
      const file = request.file('photo', {
        types: ['image'],
        size: '20mb'
      })

      if (!file) {
        return response.badRequest({ message: 'Nenhum arquivo enviado' })
      }

      const product = await this.productPhotosService.addProductPhoto(productId, file)
      return response.created(product)
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.notFound({ message: error.message })
      }
      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * Create product photo (original version)
   * POST /api/products/:productId/photos/original
   */
  async createOriginal({ params, request, response }) {
    try {
      const { productId } = params
      const file = request.file('photo', {
        types: ['image'],
        size: '20mb'
      })

      if (!file) {
        return response.badRequest({ message: 'Nenhum arquivo enviado' })
      }

      const mimeType = file.type || 'image/jpeg'
      const photo = await this.productPhotosService.createProductPhoto(productId, file, mimeType)
      return response.created(photo)
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.notFound({ message: error.message })
      }
      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * Delete product photo
   * DELETE /api/products/:productId/photos/:photoId
   */
  async destroy({ params, response }) {
    try {
      const { productId, photoId } = params
      const product = await this.productPhotosService.deleteProductPhoto(productId, photoId)
      return response.ok(product, { message: 'Foto eliminada com sucesso' })
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.notFound({ message: error.message })
      }
      return response.internalServerError({ message: error.message })
    }
  }
}

module.exports = ProductPhotosController
