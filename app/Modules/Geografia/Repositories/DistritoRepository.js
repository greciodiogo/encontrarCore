
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class DistritoRepository extends BaseStorageRepository{

    constructor() {
      super('Distrito',"App/Modules/Geografia/Models/")
    }

    }
    module.exports = DistritoRepository
