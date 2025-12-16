"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");
const RoleRepository = use(
  "App/Modules/Security/Acl/Repositories/RoleRepository"
);
const UserRepository = use(
  "App/Modules/Security/Users/Repositories/UserRepository"
);

const NotFoundException = use("App/Exceptions/NotFoundException");
const NotCreatedException = use("App/Exceptions/NotCreatedException");
const ModuloRepository = use(
  "App/Modules/Security/Acl/Repositories/ModuloRepository"
);
const ModuloPermissaoRepository = use(
  "App/Modules/Security/Acl/Repositories/ModuloPermissaoRepository"
);

var moment = require("moment");
const encriptar = use("App/Helpers/encrypt");


const Database = use('Database')
class PermissionRepository extends BaseStorageRepository {
  permissionsOfModulo = []
  permissionsJson = []
  permissionsModulo = []

  constructor(connection = 'mysql') {
    super("Permission", "App/Modules/Security/Acl/Models/",connection);
  }

  async attachPermissionsToRole(role_id, permissions) {
    try {
      const role = await new RoleRepository().model.find(role_id);
      return await role.permissions().attach(permissions);
    } catch (error) {
      throw new NotCreatedException(
        "Não foi possivel finalizar a operação, " + error
      );
    }
  }

  async detachPermissionsToRole(role_id, permissions) {
    try {
      const role = await new RoleRepository().model.find(role_id);
      return await role.permissions().detach(permissions);
    } catch (error) {
      throw new NotCreatedException(
        "Não foi possivel finalizar a operação, " + error
      );
    }
  }

  async attachPermissionsToUser(user_id, permissions) {
    try {
      const role = await new UserRepository().model.find(user_id);
      return await role.permissions().attach(permissions);
    } catch (error) {
      throw new NotCreatedException(
        "Não foi possivel finalizar a operação, " + error
      );
    }
  }

  async detachPermissionsToUser(user_id, permissions) {
    try {
      const user = await new UserRepository().model.find(user_id);
      return await user.permissions().detach(permissions);
    } catch (error) {
      throw new NotCreatedException(
        "Não foi possivel finalizar a operação, " + error
      );
    }
  }

  /**
   * get All Permissions of a role
   * GET Role's Permissions
   *
   * @author Caniggia Moreira caniggiamoreira@gmail.com
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async getAllPermissionsOfRole(role_id) {
    try {
      const role = await new RoleRepository().model.find(role_id);

      const permissionsOfRole = [];
      const permissionsJson = (await this.model.all()).toJSON();
      const permissionsRole = await role.getPermissions();

      permissionsJson.forEach(function (x) {
        const permission = { ...x, checked: permissionsRole.includes(x.slug) };
        permissionsOfRole.push(permission);
      });

      return permissionsOfRole;
    } catch (error) {
      throw new NotFoundException("Nenhum resultado foi encontrado.");
    }
  }

  /**
  * get All Permissions of a role
  * GET Role's Permissions
  *
  * @author Caniggia Moreira caniggiamoreira@gmail.com
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  * @param {View} ctx.view
  */
  async getAllPermissionsOfRoleModulo(role_id, parametro) {
    try {
      return await this.getPermissionsByModuloAndRole(role_id, parametro.modulo_id, parametro.pageAssociated, parametro.perPageAssociated, parametro.filtroAssociated);
    } catch (error) {
      console.log("error:" + error)
      throw new NotFoundException("Nenhum resultado foi encontrado.");
    }
  }

  async getAllNotPermissionsOfRoleModulo(role_id, parametro) {
    try {
      return await this.getPermissionsByModuloWithoutRole(role_id, parametro.modulo_id, parametro.page, parametro.perPage, parametro.filtro);
    } catch (error) {
      console.log("error:" + error)
      throw new NotFoundException("Nenhum resultado foi encontrado.");
    }
  }


  /**
   * get All Permissions of a role
   * GET Role's Permissions
   *
   * @author Caniggia Moreira caniggiamoreira@gmail.com
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async getAllPermissionsOfUser(user_id) {
    try {
      const user = await new UserRepository().model.find(user_id);

      const permissionsOfUser = [];
      const permissionsJson = (await this.model.all()).toJSON();
      const permissionsUser = await user.getPermissions();

      permissionsJson.forEach(function (x) {
        const permission = { ...x, checked: permissionsUser.includes(x.slug) };
        permissionsOfUser.push(permission);
      });

      return permissionsOfUser;
    } catch (error) {
      throw new NotFoundException("Nenhum resultado foi encontrado.");
    }
  }

  /**
   * get All Permissions of a role
   * GET Role's Permissions
   *
   * @author Matondo Quela mavipela@gmail.com
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async getAllPermissionsOfModulo(modulo_id, parametro) {
    try {
      let permissoes = [];

      if (parametro.carregar_permissoes == 2) {//Pegar Permissoes do modulo para um SubModulo
        permissoes = await this.getPermissionsByNotSubModuloPaginacao(modulo_id, parametro, parametro.idModuloAncestral);
      } else {
        permissoes = await this.getPermissionsByNotModuloPaginacao(modulo_id, parametro.page, parametro.perPage, parametro.filtro);
      }
      return permissoes;

    } catch (error) {
      console.log("error:" + error)
      throw new NotFoundException("Nenhum resultado foi encontrado.");
    }
  }

  async getPermissionsByModulo(modulo_id) {

    return await Database.select(
      'p.*',
    ).from('permissions as p')
      .innerJoin("modulo_permissaos as mp", "mp.permissao_id", "p.id")
      .where("mp.modulo_id", modulo_id)
      .where("p.is_deleted", 0)
      .where("mp.is_deleted", 0)

  }

  async getPermissionsByModuloPaginacao(modulo_id, page, perPage, filtro = null) {

    return await Database.select(
      'p.*',
    ).from('permissions as p')
      .innerJoin("modulo_permissaos as mp", "mp.permissao_id", "p.id")
      .where("mp.modulo_id", modulo_id)
      .where("p.is_deleted", 0)
      .where("mp.is_deleted", 0)
      .where(function () {
        if (filtro != null && filtro != undefined && filtro.length > 0) {
          this.where("p.name", "like", `%${filtro}%`)
        }
      })
      .paginate(page, perPage)

  }

  async getPermissionsByModuloAndRole(role_id, modulo_id, page, perPage, filtro) {

    const rolePermission = Database.select(
      'pr.permission_id',
    ).from('permission_role as pr')
      .where("pr.role_id", role_id);

    return await Database.select(
      'p.*',
    ).from('permissions as p')
      .innerJoin("modulo_permissaos as mp", "mp.permissao_id", "p.id")
      .where("mp.modulo_id", modulo_id)
      .where("p.is_deleted", 0)
      .where("mp.is_deleted", 0)
      .where(function () {
        if (filtro != null && filtro != undefined) {
          this.where("p.name", "like", `%${filtro}%`)
        }
      })
      .whereIn("p.id", rolePermission)
      .paginate(page, perPage)

  }

  async getPermissionsByModuloWithoutRole(role_id, modulo_id, page, perPage, filtro) {

    const rolePermission = Database.select(
      'pr.permission_id',
    ).from('permission_role as pr')
      .where("pr.role_id", role_id);


    return await Database.select(
      'p.*',
    ).from('permissions as p')
      .innerJoin("modulo_permissaos as mp", "mp.permissao_id", "p.id")
      .where("mp.modulo_id", modulo_id)
      .where("p.is_deleted", 0)
      .where("mp.is_deleted", 0)
      .where(function () {
        if (filtro != null && filtro != undefined) {
          this.where("p.name", "like", `%${filtro}%`)
        }
      })
      .whereNotIn("p.id", rolePermission)
      .paginate(page, perPage)

  }

  async getPermissionsBySubModuloPaginacao(parametro) {

    return await Database.select(
      'p.*',
    ).from('permissions as p')
      .innerJoin("modulo_permissaos as mp", "mp.permissao_id", "p.id")
      .where("mp.modulo_id", parametro.modulo_id)
      .where("p.is_deleted", 0)
      .where("mp.is_deleted", 0)
      .where(function () {
        if (parametro.filtro != null && parametro.filtro != undefined) {
          this.where("p.name", "like", `%${parametro.filtro}%`)
        }
      })
      .paginate(parametro.page, parametro.perPage)

  }

  async getPermissionsByNotModuloPaginacao(modulo_id, page, perPage, filtro) {

    const permissoesDoModulo = Database.select(
      'p.id',
    ).from('permissions as p')
      .innerJoin("modulo_permissaos as mp", "mp.permissao_id", "p.id")
      .where("mp.modulo_id", modulo_id)
      .where("p.is_deleted", 0)
      .where("mp.is_deleted", 0);

    return await Database.select(
      'p.*',
    ).from('permissions as p')
      .where("p.is_deleted", 0)
      .where(function () {
        if (filtro != null && filtro != undefined && filtro.length > 0) {
          this.where("p.name", "like", `%${filtro}%`)
        }
      })
      .whereNotIn('id', permissoesDoModulo)
      .paginate(page, perPage)

  }

  async getPermissionsByNotSubModuloPaginacao(modulo_id, paginacao, IdModuloAncestral) {

    const permissoesDoSubModulo = Database.select(
      'p.id',
    ).from('permissions as p')
      .innerJoin("modulo_permissaos as mp", "mp.permissao_id", "p.id")
      .where("mp.modulo_id", modulo_id)
      .where("p.is_deleted", 0)
      .where("mp.is_deleted", 0);

    return await Database.select(
      'p.*',
    ).from('permissions as p')
      .innerJoin("modulo_permissaos as mp", "mp.permissao_id", "p.id")
      .where("mp.modulo_id", IdModuloAncestral)
      .where("p.is_deleted", 0)
      .where("mp.is_deleted", 0)
      .where(function () {
        if (paginacao.filtro != null && paginacao.filtro != undefined && paginacao.filtro.length > 0) {
          this.where("p.name", "like", `%${paginacao.filtro}%`)
        }
      })
      .whereNotIn('p.id', permissoesDoSubModulo)
      .paginate(paginacao.page, paginacao.perPage);

  }


  /**
  * get All Permissions associated of a module
  * GET Role's Permissions
  *
  * @author Matondo Quela mavipela@gmail.com
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  * @param {View} ctx.view
  */
  async getAllPermissionsAssociatedOfModulo(modulo_id, parametro) {
    try {

      let permissoes = await this.getPermissionsByModuloPaginacao(modulo_id, parametro.page, parametro.perPage, parametro.filtro);
      return permissoes;

    } catch (error) {
      console.log("error:" + error)
      throw new NotFoundException("Nenhum resultado foi encontrado.");
    }
  }

  async criarPermissao(createdPayload) {
    const permissionObjecto = {
      slug: createdPayload.slug,
      name: createdPayload.nome,
      key: encriptar(createdPayload.slug),
      name_menu: createdPayload.nome,
      type_permission: "M"
    };

    return await Database.table('permissions').insert(permissionObjecto)
  

  }

  preencherSlug(textoNome) {
    textoNome = textoNome.toLowerCase().replace(/ /g, "-");
    return textoNome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  }





}
module.exports = PermissionRepository;
