
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class MoedaRepository extends BaseStorageRepository{

    constructor() {
      super('Moeda',"App/Modules/Utilitarios/Models/")
    }

    }
    module.exports = MoedaRepository
