'use strict'

const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');

class SplashScreenRepository extends BaseStorageRepository {
  constructor() {
    super("SplashScreen", "App/Modules/Utilitarios/Models/");
  }
}

module.exports = SplashScreenRepository
