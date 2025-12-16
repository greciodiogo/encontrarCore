
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class ShopsRepository extends BaseStorageRepository{
        
    constructor() {
      super("Shops", "App/Modules/Catalog/Models/")
    } 
    
    }    
    module.exports = ShopsRepository
    