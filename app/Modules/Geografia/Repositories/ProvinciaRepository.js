
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class ProvinciaRepository extends BaseStorageRepository{

    constructor() {
      super('Provincia',"App/Modules/Geografia/Models/")
    }

    }
    module.exports = ProvinciaRepository
