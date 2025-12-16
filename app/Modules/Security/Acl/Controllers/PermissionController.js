'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const PermissionRepository = use('App/Modules/Security/Acl/Repositories/PermissionRepository')
const gearAss = use("App/Helpers/gearAss");
const encriptar = use("App/Helpers/encrypt");
const Database = use('Database')
var moment = require("moment");
/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with Permissions
 */
class PermissionController {

  #PermissionRepo;

  permissions = [{
    name: 'Listar',
    description: 'O utilizador pode listar e filtrar '
  },
  {
    name: 'Criar',
    description: 'O utilizador pode criar ou adicionar '
  },
  {
    name: 'Actualizar',
    description: 'O utilizador pode actualizar '
  },
  {
    name: 'Apagar',
    description: 'O utilizador pode excluir '
  }
  ]

  createListOfRoutePermissions = []

  constructor() {
    this.#PermissionRepo = new PermissionRepository()
  }


  /**
   * Show a list of all Permissions.
   * GET Permissions
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ params, request, response, view }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id", "name"],
      isPaginate: true,
      filtro: request.input("search"),
      typeFilter: true
    };

    //Pegar permissoes por role e modulo
    if (request.input("modulo_id") && request.input("role_id")) {
      options["modulo_id"] = request.input("modulo_id")
      const data = await this.#PermissionRepo.getAllPermissionsOfRoleModulo(request.input("role_id"), options);
      return response.ok(data);
    }


    //Pegar associadas ou não ao modulo
    if (request.input("carregar_permissoes")) {
      options["carregar_permissoes"] = request.input("carregar_permissoes");
      options["modulo_id"] = request.input("modulo_id");
      options["idModuloAncestral"] = request.input("idModuloAncestral");
      const data = await this.#PermissionRepo.getAllPermissionsOfModulo(request.input("modulo_id"), options);
      return response.ok(data);
    }

    let query = this.#PermissionRepo.findAll(search, options).where("is_deleted", 0)
    const data = await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
    return response.ok(data);
  }

  /**
   * Show a list of all Permissions associated to role.
   * GET Permissions
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async getPermissoesAssociadasARole({ params, request, response, view }) {
    const options = {
      pageAssociated: request.input("pageAssociated") || 1,
      perPageAssociated: request.input("perPageAssociated") || 5,
      orderByAssociated: request.input("orderByAssociated") || "id",
      typeOrderByAssociated: request.input("typeOrderByAssociated") || "DESC",
      searchBy: ["id", "name"],
      isPaginate: true,
      filtroAssociated: request.input("searchAssociated")
    };

    options["modulo_id"] = request.input("modulo_id")
    const data = await this.#PermissionRepo.getAllPermissionsOfRoleModulo(request.input("role_id"), options);
    return response.ok(data);

  }

  /**
   * Show a list of all Permissions don´t associated to role.
   * GET Permissions
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async getPermissoesNaoAssociadasARole({ params, request, response, view }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id", "name"],
      isPaginate: true,
      filtro: request.input("search")
    };

    options["modulo_id"] = request.input("modulo_id")
    const data = await this.#PermissionRepo.getAllNotPermissionsOfRoleModulo(request.input("role_id"), options);
    return response.ok(data);

  }

  /**
   * Create/save a new Permission.
   * POST Permissions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const createdPayload = request.all();
    await this.prepararPermissoesARegistar(createdPayload)
    await Database.insert(this.createListOfRoutePermissions).into('permissions')
    return response.created("", { message: 'registo inserido com sucesso' });
  }

  async prepararPermissoesARegistar(permissaoARegistar) {
    this.createListOfRoutePermissions = []
    for (let i = 0; i < (permissaoARegistar.is_crud ? this.permissions.length : 1); i++) {
      const permission = this.permissions[i];
      let objecto = {
        name: `${(permissaoARegistar.is_crud) ? (permission.name + ' ' + permissaoARegistar.name.toLowerCase()) : permissaoARegistar.name}`,
        slug: `${(permissaoARegistar.is_crud) ? (permission.name.toLowerCase() + '-' + permissaoARegistar.slug.toLowerCase()) : permissaoARegistar.slug.toLowerCase()}`,
        description: `${(permissaoARegistar.is_crud) ? (permission.description + ' ' + permissaoARegistar.name.toLowerCase()) : permissaoARegistar.description}`,
        key: encriptar(`${(permissaoARegistar.is_crud) ? (permission.name.toLowerCase() + '-' + permissaoARegistar.slug.toLowerCase()) : permissaoARegistar.slug.toLowerCase()}`),
        name_menu: permissaoARegistar.name_menu,
        color_text_name: permissaoARegistar.color_text_name,
        color_background_name: permissaoARegistar.color_background_name,
        color_icon: permissaoARegistar.color_icon,
        color_background_icon: permissaoARegistar.color_background_icon,
        route: permissaoARegistar.route,
        access_mode: permissaoARegistar.access_mode,
        type_operation: permissaoARegistar.type_operation,
        permission_id: permissaoARegistar.permission_id,
        type_permission:"A",
        created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
      }
      let existe = await this.isCreated(objecto);
      if (existe && !permissaoARegistar.is_crud)
        return response.badRequest("", { message: 'Já existe permissão cadastrada com os dados inseridos' });

      if (existe && permissaoARegistar.is_crud)
        continue;
      else {
        this.createListOfRoutePermissions.push(objecto);
      }
    }
  }
  /**
   * Display a single Permission.
   * GET Permissions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const data = await this.#PermissionRepo.findById(params.id);
    return response.ok(data);
  }

  /**
   * Update Permission details.
   * PUT or PATCH Permissions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const chave = gearAss(updatedPayload.slug);
    updatedPayload["key"] = chave;

    if (await this.isCreatedOnUpdated(updatedPayload, id))
      return response.badRequest("", { message: 'Já existe permissão cadastrada com dados inseridos ' });

    delete updatedPayload["is_crud"];
    const data = await this.#PermissionRepo.update(id, updatedPayload);
    return response.ok(data, { message: 'successfully updated object', data: data });
  }

  /**
   * Delete a Permission with id.
   * DELETE Permissions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const data = await this.#PermissionRepo.delete(params.id);
    return response.ok(data);
  }

  /**
   * attachOrDetachPermissionsToRole a Permission with id.
   * DELETE Permissions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async attachOrDetachPermissionsToRole({ request, response, auth }) {
    const { role_id, attachPermission, detachPermission, accao } = request.all();
    if (accao === "Adicionar") {
      for (let permission of attachPermission) {
        await this.#PermissionRepo.attachPermissionsToRole(role_id, permission);
      }
    }
    else
      await this.#PermissionRepo.detachPermissionsToRole(role_id, detachPermission);
    return response.created(null, { message: 'Registo com sucesso' });
  }

  /**
   * attachOrDetachPermissionsToUser a Permission with id.
   * DELETE Permissions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async attachOrDetachPermissionsToUser({ request, response, auth }) {
    const { user_id, attachPermission, detachPermission } = request.all();
    await this.#PermissionRepo.attachPermissionsToUser(user_id, attachPermission);
    await this.#PermissionRepo.detachPermissionsToUser(user_id, detachPermission);

    return response.created(null, { message: 'Registo com sucesso' });
  }

  /* get All Permissions of a role
   * GET Role's Permissions
   *
   * @author matondo  Quela mavipela@gmail.com
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async getAllPermissionsOfRoleModulo({ params, response, request }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 10,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id", "name"],
      isPaginate: true,
      modulo_id: request.input("modulo_id")
    };

    const data = await this.#PermissionRepo.getAllPermissionsOfRoleModulo(params.id, options);
    return response.ok(data);
  }

  /* get All Permissions of a role
 * GET Role's Permissions
 *
 * @author Caniggia Moreira caniggiamoreira@gmail.com
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
  async getAllPermissionsOfRole({ params, response }) {
    const data = await this.#PermissionRepo.getAllPermissionsOfRole(params.id);
    return response.ok(data);
  }

  /* get All Permissions of a role
* GET Role's Permissions
*
* @author Matondo Qula mavipela@gmail.com
* @param {object} ctx
* @param {Request} ctx.request
* @param {Response} ctx.response
* @param {View} ctx.view
*/
  async getAllPermissionsOfModulo({ params, response, request }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 10,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id", "nome"],
      isPaginate: true,
      carregar_permissoes: request.input("carregar_permissoes"),
      modulo_id: request.input("modulo_id")
    };

    const data = await this.#PermissionRepo.getAllPermissionsOfModulo(params.id, options);

    return response.ok(data);
  }

  async getAllPermissionsOfUser({ params, response }) {
    const data = await this.#PermissionRepo.getAllPermissionsOfUser(params.id);
    return response.ok(data);
  }

  async isCreated(dados) {
    try {
      const data = await this.#PermissionRepo.findAll().where("name", dados.name).where("slug", dados.slug).fetch();
      return (data.length == undefined) ? false : true
    } catch (error) {
      console.log("error:" + error)
    }
  }

  async isCreatedOnUpdated(dados, id) {
    const data = await this.#PermissionRepo.findAll().where("name", dados.name).where("slug", dados.slug).whereNot("id", id).fetch();
    return (data.length == 0 || data.length == undefined) ? false : true;
  }

  /**
  * Show a list of all Permissions associated to modulo.
  * GET Permissions
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  * @param {View} ctx.view
  */
  async getPermissoesAssociadasAoModulo({ params, request, response, view }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id", "name"],
      isPaginate: true,
      filtro: request.input("search"),
      typeFilter: true
    };

    options["carregar_permissoes"] = request.input("carregar_permissoes");
    options["modulo_id"] = request.input("modulo_id");
    options["idModuloAncestral"] = request.input("idModuloAncestral");
    const data = await this.#PermissionRepo.getAllPermissionsAssociatedOfModulo(request.input("modulo_id"), options);

    return response.ok(data);

  }

}

module.exports = PermissionController
