
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class UsersRepository extends BaseStorageRepository{
        
    constructor() {
      super("User", "App/Modules/Authentication/Models/")
    } 
    
    }    
    module.exports = UsersRepository
    