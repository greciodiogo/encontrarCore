const OrganismoServices = use('App/Modules/Utilitarios/Services/OrganismoService');

class OrganismoController {
  #organismoService

  constructor(){
    this.#organismoService = new OrganismoServices()

  }

  /**
   * Show a list of all organismos.
   * GET organismos
   *
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
      searchBy: ["id", "nome", "descricao"],
      withRalationships: ["operador"],
    };
    const allAOrg = await this.#organismoService.show(search, options);
    return response.ok(allAOrg);

  }

  /**
   * Render a form to be used for creating a new organismo.
   * GET organismos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new organismo.
   * POST organismos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const user = await auth.getUser();
    const organismo = request.only(['nome', 'descricao', 'sigla', 'is_actived'])
    const data = await this.#organismoService.store({ fields: organismo, user_id: user.id })
    response.created(data, { message: "Registo inserido com sucesso" })
  }

  /**
   * Render a form to update an existing organismo.
   * GET organismos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {

    const organismo_id = params.organismo_id
    const organismo = request.only(['nome', 'descricao', 'sigla', 'is_actived'])
    const data = await this.#organismoService.edit({ fields: organismo, organismo_id })
    return response.ok(data, { message: "Organismo Actualizado com sucesso" })
  }

  async findById({ params, response }) {
    const organismo_id = params.organismo_id;
    const data = await this.#organismoService.showById(organismo_id);
    console.log(data)
    return response.ok(data)
  }

  async findByNome({ params, response }) {
    const nome = params.nome;
    const data = await this.#organismoService.showByNome(nome);
    return response.ok(data)
  }

  /**
   * Update organismo details.
   * PUT or PATCH organismos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a organismo with id.
   * DELETE organismos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = OrganismoController
