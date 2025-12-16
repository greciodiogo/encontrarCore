'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const RoleRepository = use('App/Modules/Security/Acl/Repositories/RoleRepository')
const UserRepository = use('App/Modules/Security/Users/Repositories/UserRepository')
const Database = use("Database")

/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with Roles
 */
class RoleController {

  #RoleRepo;
  #userRepository;

  constructor() {
    this.#RoleRepo = new RoleRepository()
    this.#userRepository = new UserRepository()
  }


  /**
   * Show a list of all Roles.
   * GET Roles
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id", "name"],
      isPaginate: true,
      typeFilter: true
    };
    let query = this.#RoleRepo.findAll(search, options).with("direccao")
    const data = await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
    return response.ok(data);
  }

  /**
   * Create/save a new Role.
   * POST Roles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const createdPayload = request.all();
    const data = await this.#RoleRepo.create(createdPayload);
    return response.created(data, { message: 'registo inserido com sucesso' });
  }

  /**
   * Display a single Role.
   * GET Roles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const data = await this.#RoleRepo.findById(params.id);
    return response.ok(data);
  }

  /**
   * Update Role details.
   * PUT or PATCH Roles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const data = await this.#RoleRepo.update(id, updatedPayload);
    await this.actualizarDireccaoDoSUsersDaRole(updatedPayload.direccao_id,id)
    return response.ok(data, { message: 'successfully updated object', data: data });
  }

  /**
   * Delete a Role with id.
   * DELETE Roles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const data = await this.#RoleRepo.delete(params.id);
    return response.ok(data);
  }

  async actualizarDireccaoDoSUsersDaRole(direccaoID,roleID) {
    let usersId=await Database.select("user_id").from("role_user").where("role_id",roleID)
    usersId= usersId?usersId?.map((user)=>user.user_id):[]
    const dadosVerificar = {"id":usersId};
    const dadosActualizar = {direccao_id:direccaoID}
    await this.#userRepository.updateInForData(dadosVerificar, dadosActualizar);
  }

}

module.exports = RoleController
