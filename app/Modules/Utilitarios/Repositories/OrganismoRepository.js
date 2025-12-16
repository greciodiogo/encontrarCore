
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class OrganismoRepository extends BaseStorageRepository{

    constructor() {
      super('Organismo',"App/Modules/Utilitarios/Models/")
    }

    }
    module.exports = OrganismoRepository
