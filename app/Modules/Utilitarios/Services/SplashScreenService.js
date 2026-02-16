'use strict'

const SplashScreenRepository = use('App/Modules/Utilitarios/Repositories/SplashScreenRepository')
const Helpers = use('Helpers')
const fs = require('fs').promises

class SplashScreenService {
  constructor() {
    this.repository = new SplashScreenRepository()
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
    return await this.repository.model
      .query()
      .where('is_active', true)
      .orderBy('order', 'asc')
      .fetch()
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
    // Upload da imagem se fornecida
    if (file) {
      data.image_url = await this.uploadImage(file)
    }

    return await this.repository.create(data)
  }

  /**
   * Atualizar splash screen
   */
  async update(id, data, file = null) {
    const splashScreen = await this.findById(id)

    // Upload da nova imagem se fornecida
    if (file) {
      // Deletar imagem antiga se existir
      if (splashScreen.image_url) {
        await this.deleteImage(splashScreen.image_url)
      }
      data.image_url = await this.uploadImage(file)
    }

    return await this.repository.update(id, data)
  }

  /**
   * Deletar splash screen
   */
  async delete(id) {
    const splashScreen = await this.findById(id)

    // Deletar imagem associada
    if (splashScreen.image_url) {
      await this.deleteImage(splashScreen.image_url)
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
   * Upload de imagem
   */
  async uploadImage(file) {
    const fileName = `${Date.now()}_${file.clientName}`
    const uploadPath = Helpers.publicPath('uploads/splash_screens')

    // Criar diretório se não existir
    try {
      await fs.mkdir(uploadPath, { recursive: true })
    } catch (error) {
      console.error('Erro ao criar diretório:', error)
    }

    await file.move(uploadPath, {
      name: fileName,
      overwrite: true
    })

    if (!file.moved()) {
      throw new Error(file.error())
    }

    // Retornar URL completa
    return `/uploads/splash_screens/${fileName}`
  }

  /**
   * Deletar imagem
   */
  async deleteImage(imageUrl) {
    try {
      // Extrair caminho do arquivo da URL
      const fileName = imageUrl.split('/').pop()
      const fullPath = Helpers.publicPath(`uploads/splash_screens/${fileName}`)

      // Verificar se arquivo existe e deletar
      try {
        await fs.access(fullPath)
        await fs.unlink(fullPath)
      } catch (error) {
        // Arquivo não existe, ignorar
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
      // Não lançar erro para não bloquear a operação principal
    }
  }
}

module.exports = SplashScreenService
