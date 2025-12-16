
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class ParametroGeralRepository extends BaseStorageRepository{

    constructor() {
      super('ParametroGeral',"App/Modules/Utilitarios/Models/")
    }

    }
    module.exports = ParametroGeralRepository
