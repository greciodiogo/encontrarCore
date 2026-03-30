'use strict'

const BannerRepository = use('App/Modules/Utilitarios/Repositories/BannerRepository')
const LocalFilesService = use('App/Services/LocalFilesService')
const Env = use('Env')
const sharp = require('sharp')

class BannerService {
  constructor() {
    this.repository = new BannerRepository()
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
   * Upload de banner para Supabase (pasta específica: uploads/banners/)
   */
  async uploadBannerImage(file, language = 'pt') {
    try {
      const extension = 'jpg'
      const originalName = file.clientName || file.originalname || 'banner'
      const safeName = originalName.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-')
      const filePath = `uploads/banners/${Date.now()}-${safeName}-${language}.${extension}`

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
      console.error('Erro ao fazer upload de banner:', error)
      throw error
    }
  }

  /**
   * Listar todos os banners (para admin)
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
   * Listar banners ativos (para mobile app e website)
   */
  async findAllActive() {
    const banners = await this.repository.model
      .query()
      .where('is_active', true)
      .orderBy('order', 'asc')
      .fetch()

    // Converter para JSON e adicionar URL pública completa
    const bannersJson = banners.toJSON()
    return bannersJson.map(banner => ({
      ...banner,
      image_url_pt: banner.image_url_pt ? this.getPublicUrl(banner.image_url_pt) : null,
      image_url_en: banner.image_url_en ? this.getPublicUrl(banner.image_url_en) : null
    }))
  }

  /**
   * Buscar banner por ID
   */
  async findById(id) {
    const banner = await this.repository.findById(id).first()
    if (!banner) {
      throw new Error('Banner não encontrado')
    }
    return banner
  }

  /**
   * Criar novo banner
   */
  async create(data, filePt = null, fileEn = null) {
    // Upload da imagem PT para Supabase se fornecida
    if (filePt) {
      const { path } = await this.uploadBannerImage(filePt, 'pt')
      data.image_url_pt = path
    }

    // Upload da imagem EN para Supabase se fornecida
    if (fileEn) {
      const { path } = await this.uploadBannerImage(fileEn, 'en')
      data.image_url_en = path
    }

    return await this.repository.create(data)
  }

  /**
   * Atualizar banner
   */
  async update(id, data, filePt = null, fileEn = null) {
    const banner = await this.findById(id)

    // Upload da nova imagem PT para Supabase se fornecida
    if (filePt) {
      // Deletar imagem antiga do Supabase se existir
      if (banner.image_url_pt) {
        await this.deleteImageFromSupabase(banner.image_url_pt)
      }
      
      const { path } = await this.uploadBannerImage(filePt, 'pt')
      data.image_url_pt = path
    }

    // Upload da nova imagem EN para Supabase se fornecida
    if (fileEn) {
      // Deletar imagem antiga do Supabase se existir
      if (banner.image_url_en) {
        await this.deleteImageFromSupabase(banner.image_url_en)
      }
      
      const { path } = await this.uploadBannerImage(fileEn, 'en')
      data.image_url_en = path
    }

    return await this.repository.update(id, data)
  }

  /**
   * Deletar banner
   */
  async delete(id) {
    const banner = await this.findById(id)

    // Deletar imagens do Supabase
    if (banner.image_url_pt) {
      await this.deleteImageFromSupabase(banner.image_url_pt)
    }
    if (banner.image_url_en) {
      await this.deleteImageFromSupabase(banner.image_url_en)
    }

    return await this.repository.delete(id)
  }

  /**
   * Ativar/Desativar banner
   */
  async toggleActive(id) {
    const banner = await this.findById(id)
    return await this.repository.update(id, { 
      is_active: !banner.is_active 
    })
  }

  /**
   * Reordenar banners
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

module.exports = BannerService
