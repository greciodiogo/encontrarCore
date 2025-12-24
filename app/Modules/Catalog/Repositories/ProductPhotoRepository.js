'use strict'

const BaseStorageRepository = use('App/Repositories/BaseStorageRepository')

class ProductPhotoRepository extends BaseStorageRepository {
  constructor() {
    super('ProductPhoto', 'App/Modules/Catalog/Models/')
  }

  /**
   * Find product photo by productId and photoId
   * @param {number} productId
   * @param {number} photoId
   * @returns {Promise<Object|null>}
   */
  async findByProductAndPhoto(productId, photoId) {
    return await this.model
      .query()
      .where('id', photoId)
      .where('productId', productId)
      .first()
  }

  /**
   * Find all photos for a product
   * @param {number} productId
   * @returns {Promise<Array>}
   */
  async findByProduct(productId) {
    return await this.model
      .query()
      .where('productId', productId)
      .fetch()
  }
}

module.exports = ProductPhotoRepository

