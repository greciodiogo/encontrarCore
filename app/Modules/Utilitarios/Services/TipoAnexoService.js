 const TipoAnexoRepository= use('App/Modules/GestaoDocumental/Repositories/TipoAnexoRepository')
class TipoAnexoService{
    #tipoAnexoRepo
    constructor(){
      this.#tipoAnexoRepo= new TipoAnexoRepository()
    }
     async store({fields, user_id}){
       const tipo_anexosfields= {...fields, user_id}
       return await this.#tipoAnexoRepo.create(tipo_anexosfields)
     }

     async show(search, options){
          return await this.#tipoAnexoRepo.findAll(search, options)
         .paginate(options.page, (options.perPage || 10))
     }


     async showById(tipo_anexo_id){
         if(tipo_anexo_id){
            return await this.#tipoAnexoRepo.findById(tipo_anexo_id).first()

         }

     }
     async delete(tipo_anexo_id){
        return await this.#tipoAnexoRepo.delete(tipo_anexo_id)
     }
     async edit(fields,tipo_anexo_id){
         if(fields){
           return await this.#tipoAnexoRepo.update(tipo_anexo_id, fields)
         }
     }
}
module.exports= TipoAnexoService
