
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class ProductsRepository extends BaseStorageRepository{
        
    constructor() {
      super("Product", "App/Modules/Catalog/Models/")
    } 
    
    }    
    module.exports = ProductsRepository
    