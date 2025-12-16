
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class PaisRepository extends BaseStorageRepository{

    constructor() {
      super('Pais',"App/Modules/Geografia/Models/")
    }

    }
    module.exports = PaisRepository
