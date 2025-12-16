
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class BancoRepository extends BaseStorageRepository{

    constructor() {
      super('Banco',"App/Modules/Utilitarios/Models/")
    }

    }
    module.exports = BancoRepository
