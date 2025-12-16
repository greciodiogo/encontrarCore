
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class ResetPasswordRepository extends BaseStorageRepository{
        
    constructor() {
      super('ResetPassword',"App/Modules/Security/Auth/Models/")
    } 
    
    }    
    module.exports = ResetPasswordRepository
    