
const FilialService= require('../Services/FilialService')
class FilialController{
    #filialService
    constructor(){
      this.#filialService= new FilialService();
    }

    

      async store({request, response, auth}){
          const user= await  auth.getUser();
          const fields= request.only(['nome', 'indicativo_telefone'])
          const filial= await this.#filialService.store({fields, user_id: user.id});
          response.ok(filial, {message: 'filial criado com sucesoo'})
      }

      async index({ request, response }) {
        const search = request.input("search");
        const options = {
          page: request.input("page") || 1,
          perPage: request.input("perPage") || 5,
          orderBy: request.input("orderBy") || "id",
          typeOrderBy: request.input("typeOrderBy") || "DESC",
          searchBy: ["id", "nome", "descricao"],
        };
        const allAnexos = await this.#filialService.show(search, options);
        response.ok(allAnexos, {message: "listagem das tecnolgias"});
    }

    async edit({ request, response, params}){
        const filial_id= params.filial_id
        const filial=request.only(['nome', 'indicativo_telefone'])
        const data= await this.#filialService.edit({fields:filial,filial_id})
        response.ok(data, {message:"Filial  Actualizado com sucesso"})
    }

    async findById({params,response}){
        const filial_id= params.filial_id;
        console.log(filial_id)
        const data= await this.#filialService.showById(filial_id);
        response.ok(data, {message: "listar Filial por id"})
    }
}
module.exports= FilialController
