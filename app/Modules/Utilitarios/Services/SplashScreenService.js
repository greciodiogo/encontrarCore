'use strict'

const SplashScreenRepository = use('App/Modules/Utilitarios/Repositories/SplashScreenRepository')
const LocalFilesService = use('App/Services/LocalFilesService')
const Env = use('Env')
const sharp = require('sharp')

class SplashScreenService {
  constructor() {
    this.repository = new SplashScreenRepository()
    this.localFilesService = new LocalFilesService()
  }

  /**
   * Obter URL pública do Supabase
   */
  getPublicUrl(path) {
    const supabaseUrl = Env.get('SUPABASE_URL')
    const bucket = Env.get('SUPABASE_BUCKET', 'uploads')
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
  }

  /**
   * Upload de splash screen para Supabase (pasta específica: uploads/splash/)
   */
  async uploadSplashImage(file) {
    try {
      const extension = 'jpg'
      const originalName = file.clientName || file.originalname || 'splash'
      const safeName = originalName.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-')
      const filePath = `uploads/splash/${Date.now()}-${safeName}.${extension}`

      // Get buffer from file
      let fileBuffer
      if (file.tmpPath) {
        const fs = require('fs')
        fileBuffer = fs.readFileSync(file.tmpPath)
      } else if (file.buffer) {
        fileBuffer = file.buffer
      } else {
        throw new Error('File buffer not found')
      }

      // Convert to high-quality JPEG
      const jpegBuffer = await sharp(fileBuffer)
        .flatten({ background: '#ffffff' })
        .jpeg({ quality: 100, mozjpeg: true })
        .rotate() // auto-rotate based on EXIF
        .toBuffer()

      // Upload to Supabase
      const { error } = await this.localFilesService.supabase.storage
        .from(this.localFilesService.getBucket())
        .upload(filePath, jpegBuffer, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true,
        })

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      return { path: filePath, mimeType: 'image/jpeg' }
    } catch (error) {
      console.error('Erro ao fazer upload de splash screen:', error)
      throw error
    }
  }

  /**
   * Listar todos os splash screens (para admin)
   */
  async findAll(filters = {}) {
    const options = {
      page: filters.page || 1,
      perPage: filters.perPage || 10,
      orderBy: filters.orderBy || 'order',
      typeOrderBy: filters.typeOrderBy || 'ASC',
      searchBy: ['title', 'description'],
      isPaginate: filters.isPaginate !== false,
    }

    let query = this.repository.findAll(filters.search, options)

    // Filtro de status
    if (filters.is_active !== undefined) {
      query.where('is_active', filters.is_active)
    }

    // Paginação
    if (options.isPaginate) {
      return await query.paginate(options.page, options.perPage)
    }

    return await query.fetch()
  }

  /**
   * Listar splash screens ativos (para mobile app)
   */
  async findAllActive() {
    const splashScreens = await this.repository.model
      .query()
      .where('is_active', true)
      .orderBy('order', 'asc')
      .fetch()

    // Converter para JSON e adicionar URL pública completa
    const splashScreensJson = splashScreens.toJSON()
    return splashScreensJson.map(splash => ({
      ...splash,
      image_url: this.getPublicUrl(splash.image_url)
    }))
  }

  /**
   * Buscar splash screen por ID
   */
  async findById(id) {
    const splashScreen = await this.repository.findById(id).first()
    if (!splashScreen) {
      throw new Error('Splash screen não encontrado')
    }
    return splashScreen
  }

  /**
   * Criar novo splash screen
   */
  async create(data, file = null) {
    // Upload da imagem para Supabase se fornecida
    if (file) {
      const { path } = await this.uploadSplashImage(file)
      data.image_url = path // Salvar apenas o path: uploads/splash/...
    }

    return await this.repository.create(data)
  }

  /**
   * Atualizar splash screen
   */
  async update(id, data, file = null) {
    const splashScreen = await this.findById(id)

    // Upload da nova imagem para Supabase se fornecida
    if (file) {
      // Deletar imagem antiga do Supabase se existir
      if (splashScreen.image_url) {
        await this.deleteImageFromSupabase(splashScreen.image_url)
      }
      
      const { path } = await this.uploadSplashImage(file)
      data.image_url = path // Salvar apenas o path
    }

    return await this.repository.update(id, data)
  }

  /**
   * Deletar splash screen
   */
  async delete(id) {
    const splashScreen = await this.findById(id)

    // Deletar imagem do Supabase
    if (splashScreen.image_url) {
      await this.deleteImageFromSupabase(splashScreen.image_url)
    }

    return await this.repository.delete(id)
  }

  /**
   * Ativar/Desativar splash screen
   */
  async toggleActive(id) {
    const splashScreen = await this.findById(id)
    return await this.repository.update(id, { 
      is_active: !splashScreen.is_active 
    })
  }

  /**
   * Reordenar splash screens
   */
  async reorder(items) {
    const promises = items.map(item => {
      return this.repository.update(item.id, { order: item.order })
    })
    return await Promise.all(promises)
  }

  /**
   * Deletar imagem do Supabase Storage
   */
  async deleteImageFromSupabase(imagePath) {
    try {
      const { error } = await this.localFilesService.supabase.storage
        .from(this.localFilesService.getBucket())
        .remove([imagePath])

      if (error) {
        console.error('Erro ao deletar imagem do Supabase:', error)
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
      // Não lançar erro para não bloquear a operação principal
    }
  }
}

module.exports = SplashScreenService
