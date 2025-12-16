
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class MunicipioRepository extends BaseStorageRepository{

    constructor() {
      super('Municipio',"App/Modules/Geografia/Models/")
    }

    }
    module.exports = MunicipioRepository
