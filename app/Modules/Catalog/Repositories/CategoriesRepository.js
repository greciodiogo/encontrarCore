
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class CategoriesRepository extends BaseStorageRepository{
        
    constructor() {
      super("Categories", "App/Modules/Catalog/Models/")
    } 
    
    }    
    module.exports = CategoriesRepository
    