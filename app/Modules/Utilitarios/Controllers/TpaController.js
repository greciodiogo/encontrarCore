'use strict'
const TpaService = use('App/Modules/Utilitarios/Services/TpaService')

class TpaController {
    #TpaServ;

    constructor() {
        this.#TpaServ = new TpaService()
    }
  
    /**
     * Show a list of all Tpa.
     * GET Bancos
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index ({ request, response, view }) {
        const search = request.input("search");
        const options = {
          page: request.input("page") || 1,
          perPage: request.input("perPage") || 5,
          orderBy: request.input("orderBy") || "id",
          typeOrderBy: request.input("typeOrderBy") || "DESC",
          typeFilter:request.input("typeFilter") || '',
          lojaSeleccionada:request.input("lojaSeleccionada"),
          bancoSeleccionado:request.input("bancoSeleccionado"),
          searchBy: ["numero","descricao","loja_id","banco_id"],
          isPaginate: true
        };
        let lista_contas_bancarias = await this.#TpaServ.findAll(search,options);
       return response.ok(lista_contas_bancarias);
    }
  
    /**
     * Create/save a new Tpa.
     * POST Bancos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store ({ request, response, auth }) {
      const createdPayload = request.all();
      const data = await this.#TpaServ.create(createdPayload,1);
      return response.created(data, {message:'registo inserido com sucesso'});
    }
  
    /**
     * Display a single Tpa.
     * GET Bancos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show ({ params, response }) {
      const data = await this.#TpaServ.findById(params.id);
      return response.ok(data);
    }
  
      /**
     * Display a single Tpa.
     * GET Bancos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
       async findTpaByContaBancariaId ({ request, response }) {
        const idContabancaria = request.input('idContabancaria')
        const data = await this.#TpaServ.findTpaByContaBancariaId(idContabancaria);
        return response.ok(data);
      }
  
    /**
     * Update Tpa details.
     * PUT or PATCH Tpa/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update ({ params, request, response }) {
      const updatedPayload = request.all();
      const data = await this.#TpaServ.update(params.id, updatedPayload);
      return response.ok(data, {message:'Registo actualizado com sucesso', data: data});
    }

    async transferirTpa ({ params, request, response ,auth}) {
      const updatedPayload = request.all();
      const data = await this.#TpaServ.transferirTpa(params.id,updatedPayload,auth.user.id);
      return response.ok(data, {message:'TPA transferirdo com sucesso', data: data});
    }
  
    /**
     * Delete a Tpa with id.
     * DELETE Tpa/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy ({ params, response }) {
      const data = await this.#TpaServ.delete(params.id);
      return response.ok(data);
    }
}

module.exports = TpaController
