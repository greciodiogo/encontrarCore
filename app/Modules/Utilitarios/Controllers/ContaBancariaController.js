'use strict'

const ContaBancariaService = use('App/Modules/Utilitarios/Services/ContaBancariaService')

class ContaBancariaController {
  #ContaBancariaServ;

  constructor() {
      this.#ContaBancariaServ = new ContaBancariaService()
  }

  /**
   * Show a list of all Contas Bancarias.
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
        searchBy: ["id"],
        isPaginate: true
      };
      let lista_contas_bancarias = await this.#ContaBancariaServ.findAll(search,options);
     return response.ok(lista_contas_bancarias);
  }

  /**
   * Create/save a new Conta Bancaria.
   * POST Bancos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const createdPayload = request.all();
    const data = await this.#ContaBancariaServ.create(createdPayload,auth.user.id);
    return response.created(data, {message:'registo inserido com sucesso'});
  }

  /**
   * Display a single Contas Bancarias.
   * GET Bancos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    const data = await this.#ContaBancariaServ.findById(params.id);
    return response.ok(data);
  }

    /**
   * Display a single Contas Bancarias.
   * GET Bancos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
     async findContaBancariasByBancoId ({ request, response }) {
      const idBanco = request.input('idBanco')
      const data = await this.#ContaBancariaServ.findContaBancariasByBancoId(idBanco);
      return response.ok(data);
    }

  /**
   * Update Conta Bancaria details.
   * PUT or PATCH ContaBancaria/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const updatedPayload = request.all();
    const data = await this.#ContaBancariaServ.update(params.id, updatedPayload);
    return response.ok(data, {message:'Registo actualizado com sucesso', data: data});
  }

  /**
   * Delete a Conta Bancaria with id.
   * DELETE Conta Bancaria/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const data = await this.#ContaBancariaServ.delete(params.id);
    return response.ok(data);
  }
}

module.exports = ContaBancariaController
