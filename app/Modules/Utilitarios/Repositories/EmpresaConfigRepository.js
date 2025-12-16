
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class EmpresaConfigRepository extends BaseStorageRepository{

    constructor() {
      super('EmpresaConfig',"App/Modules/Utilitarios/Models/")
    }

    }
    module.exports = EmpresaConfigRepository
