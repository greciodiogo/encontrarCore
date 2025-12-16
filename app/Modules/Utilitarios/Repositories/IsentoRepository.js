
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class IsentoRepository extends BaseStorageRepository{
        
    constructor() {
      super('Isento',"App/Modules/Utilitarios/Models/")
    } 
    
    }    
    module.exports = IsentoRepository
    