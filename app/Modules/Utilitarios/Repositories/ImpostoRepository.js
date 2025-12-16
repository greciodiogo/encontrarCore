
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class ImpostoRepository extends BaseStorageRepository{

    constructor() {
      super('Imposto',"App/Modules/Utilitarios/Models/")
    }

    }
    module.exports = ImpostoRepository
