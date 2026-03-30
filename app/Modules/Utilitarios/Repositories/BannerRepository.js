'use strict'

const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');

class BannerRepository extends BaseStorageRepository {
  constructor() {
    super("Banner", "App/Modules/Utilitarios/Models/");
  }
}

module.exports = BannerRepository
