const FilialRepository=  require('App/Modules/Utilitarios/Repositories/FilialRepository')
class FilialService {
    #filialRepo;
    constructor(){
         this.#filialRepo= new FilialRepository();
    }

    async store({fields, user_id}){
        const filial= {...fields, user_id};
        return await this.#filialRepo.create(filial);
    }


    async show(search, options){
        return await this.#filialRepo
        .findAll(search, options)
        .paginate(options.page, options.perPage || 10)
    }

    async edit({fields, filial_id}){
        return await this.#filialRepo.update(filial_id, fields)
    }

    async showById(filial_id){
        console.log(filial_id)
        if(filial_id) return await this.#filialRepo.findById(filial_id).first()
    }
}
module.exports= FilialService
