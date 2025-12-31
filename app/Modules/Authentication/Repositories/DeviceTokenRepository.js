
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class DeviceTokenRepository extends BaseStorageRepository{
        
    constructor() {
      super("DeviceToken", "App/Modules/Authentication/Models/")
    } 
    
    }    
    module.exports = DeviceTokenRepository
    