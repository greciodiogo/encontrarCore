const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
class FilialRepository extends BaseStorageRepository{
    constructor(){
        super('Filial', "App/Modules/Utilitarios/Models/")
    }
}
module.exports= FilialRepository
