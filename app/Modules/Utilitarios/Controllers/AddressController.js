'use strict'

const Database = use('Database')

class AddressController {
  
  /**
   * Listar todos os endereços com filtros e paginação
   * GET /api/addresses
   */
  async index({ request, response }) {
    try {
      const { page = 1, perPage = 20, search, hasGps, isZone } = request.all()
      
      let query = Database
        .select('id', 'name', 'slug', 'price', 'latitude', 'longitude', 'radius_km', 'is_zone', 'visible', 'parentAddressId')
        .from('addresses')
      
      // Filtros
      if (search) {
        query = query.where('name', 'ILIKE', `%${search}%`)
      }
      
      if (hasGps === 'true') {
        query = query.whereNotNull('latitude').whereNotNull('longitude')
      }
      
      if (isZone === 'true') {
        query = query.where('is_zone', true)
      }
      
      // Paginação
      const addresses = await query
        .orderBy('name', 'asc')
        .paginate(page, perPage)
      
      console.log(`[ADDRESSES] Listados ${addresses.data.length} endereços (página ${page})`)
      
      return response.json({
        success: true,
        data: addresses
      })
    } catch (error) {
      console.error('[ADDRESSES] Erro ao listar:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao listar endereços',
        error: error.message
      })
    }
  }
  
  /**
   * Buscar endereço específico por ID
   * GET /api/addresses/:id
   */
  async show({ params, response }) {
    try {
      const address = await Database
        .select('*')
        .from('addresses')
        .where('id', params.id)
        .first()
      
      if (!address) {
        return response.status(404).json({
          success: false,
          message: 'Endereço não encontrado'
        })
      }
      
      console.log(`[ADDRESSES] Endereço encontrado: ${address.name}`)
      
      return response.json({
        success: true,
        data: address
      })
    } catch (error) {
      console.error('[ADDRESSES] Erro ao buscar:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar endereço',
        error: error.message
      })
    }
  }
  
  /**
   * Criar novo endereço
   * POST /api/addresses
   */
  async store({ request, response }) {
    try {
      const data = request.only([
        'name', 'slug', 'price', 'latitude', 'longitude', 
        'radius_km', 'is_zone', 'visible', 'parentAddressId'
      ])
      
      // Validações básicas
      if (!data.name) {
        return response.status(400).json({
          success: false,
          message: 'Nome é obrigatório'
        })
      }
      
      if (data.price === undefined || data.price === null) {
        return response.status(400).json({
          success: false,
          message: 'Preço é obrigatório'
        })
      }
      
      // Gerar slug se não fornecido
      if (!data.slug) {
        data.slug = data.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }
      
      // Defaults
      data.is_zone = data.is_zone !== undefined ? data.is_zone : false
      data.visible = data.visible !== undefined ? data.visible : true
      
      // Validar coordenadas se fornecidas
      if (data.latitude !== undefined && data.latitude !== null) {
        const lat = parseFloat(data.latitude)
        if (isNaN(lat) || lat < -90 || lat > 90) {
          return response.status(400).json({
            success: false,
            message: 'Latitude inválida (deve estar entre -90 e 90)'
          })
        }
        data.latitude = lat
      }
      
      if (data.longitude !== undefined && data.longitude !== null) {
        const lon = parseFloat(data.longitude)
        if (isNaN(lon) || lon < -180 || lon > 180) {
          return response.status(400).json({
            success: false,
            message: 'Longitude inválida (deve estar entre -180 e 180)'
          })
        }
        data.longitude = lon
      }
      
      const [id] = await Database
        .table('addresses')
        .insert(data)
        .returning('id')
      
      const address = await Database
        .select('*')
        .from('addresses')
        .where('id', id)
        .first()
      
      console.log(`[ADDRESSES] Endereço criado: ${address.name} (ID: ${address.id})`)
      
      return response.status(201).json({
        success: true,
        message: 'Endereço criado com sucesso',
        data: address
      })
    } catch (error) {
      console.error('[ADDRESSES] Erro ao criar:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao criar endereço',
        error: error.message
      })
    }
  }
  
  /**
   * Atualizar endereço existente
   * PUT /api/addresses/:id
   */
  async update({ params, request, response }) {
    try {
      const data = request.only([
        'name', 'slug', 'price', 'latitude', 'longitude', 
        'radius_km', 'is_zone', 'visible', 'parentAddressId'
      ])
      
      // Verificar se existe
      const exists = await Database
        .from('addresses')
        .where('id', params.id)
        .first()
      
      if (!exists) {
        return response.status(404).json({
          success: false,
          message: 'Endereço não encontrado'
        })
      }
      
      // Validar coordenadas se fornecidas
      if (data.latitude !== undefined && data.latitude !== null) {
        const lat = parseFloat(data.latitude)
        if (isNaN(lat) || lat < -90 || lat > 90) {
          return response.status(400).json({
            success: false,
            message: 'Latitude inválida (deve estar entre -90 e 90)'
          })
        }
        data.latitude = lat
      }
      
      if (data.longitude !== undefined && data.longitude !== null) {
        const lon = parseFloat(data.longitude)
        if (isNaN(lon) || lon < -180 || lon > 180) {
          return response.status(400).json({
            success: false,
            message: 'Longitude inválida (deve estar entre -180 e 180)'
          })
        }
        data.longitude = lon
      }
      
      // Remover campos undefined para não sobrescrever com null
      Object.keys(data).forEach(key => {
        if (data[key] === undefined) {
          delete data[key]
        }
      })
      
      await Database
        .table('addresses')
        .where('id', params.id)
        .update(data)
      
      const address = await Database
        .select('*')
        .from('addresses')
        .where('id', params.id)
        .first()
      
      console.log(`[ADDRESSES] Endereço atualizado: ${address.name} (ID: ${address.id})`)
      
      return response.json({
        success: true,
        message: 'Endereço atualizado com sucesso',
        data: address
      })
    } catch (error) {
      console.error('[ADDRESSES] Erro ao atualizar:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao atualizar endereço',
        error: error.message
      })
    }
  }
  
  /**
   * Deletar endereço
   * DELETE /api/addresses/:id
   */
  async destroy({ params, response }) {
    try {
      const exists = await Database
        .from('addresses')
        .where('id', params.id)
        .first()
      
      if (!exists) {
        return response.status(404).json({
          success: false,
          message: 'Endereço não encontrado'
        })
      }
      
      await Database
        .table('addresses')
        .where('id', params.id)
        .delete()
      
      console.log(`[ADDRESSES] Endereço deletado: ${exists.name} (ID: ${exists.id})`)
      
      return response.json({
        success: true,
        message: 'Endereço deletado com sucesso'
      })
    } catch (error) {
      console.error('[ADDRESSES] Erro ao deletar:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao deletar endereço',
        error: error.message
      })
    }
  }
}

module.exports = AddressController
