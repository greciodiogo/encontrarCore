/**
 * EXEMPLO DE USO DO LocalFilesService
 * 
 * Este arquivo mostra como usar o LocalFilesService em um Controller do AdonisJS
 * 
 * Para usar em um Controller:
 */

'use strict'

// Exemplo de Controller usando LocalFilesService
/*
const LocalFilesService = use('App/Services/LocalFilesService')

class UploadController {
  async uploadPhoto({ request, response }) {
    try {
      const file = request.file('photo', {
        types: ['image'],
        size: '20mb'
      })

      if (!file) {
        return response.badRequest({ message: 'Nenhum arquivo enviado' })
      }

      const localFilesService = new LocalFilesService()
      
      // Salvar foto
      const { path, mimeType } = await localFilesService.savePhoto(file)
      
      // Criar thumbnail
      const thumbnailPath = await localFilesService.createPhotoThumbnail(file)
      
      return response.ok({
        path,
        thumbnailPath,
        mimeType
      })
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }

  async getPhoto({ params, response }) {
    try {
      const localFilesService = new LocalFilesService()
      const blob = await localFilesService.getPhoto(params.path)
      
      if (!blob) {
        return response.notFound({ message: 'Foto não encontrada' })
      }

      // Converter blob para buffer e enviar como resposta
      const buffer = Buffer.from(await blob.arrayBuffer())
      response.header('Content-Type', 'image/jpeg')
      return buffer
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }

  async listFiles({ response }) {
    try {
      const localFilesService = new LocalFilesService()
      const files = await localFilesService.listAllFiles()
      
      return response.ok({ files })
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }

  async createPlaceholder({ request, response }) {
    try {
      const file = request.file('photo', {
        types: ['image'],
        size: '20mb'
      })

      if (!file) {
        return response.badRequest({ message: 'Nenhum arquivo enviado' })
      }

      const localFilesService = new LocalFilesService()
      const placeholder = await localFilesService.createPhotoPlaceholder(file)
      
      return response.ok({ placeholder })
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }
}

module.exports = UploadController
*/

