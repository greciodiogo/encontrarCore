"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");
const Database = use('Database')

class ModuloSubModuloRepository extends BaseStorageRepository {
  constructor() {
    super("ModuloSubModulo", "App/Modules/Security/Acl/Models/");
  }

  async getModuloSubModuloByModulo(modulo_id,submodulo_id) {

    return await Database.select(
      'ms.*',
      ).from('modulo_submodulos as ms')
      .innerJoin("modulos as m", "ms.modulo_id", "m.id")
      .where("ms.modulo_id", modulo_id)
      .where("ms.submodulo_id", submodulo_id)
      .where("m.is_deleted", 0)
      .where("ms.is_deleted", 0)
      .first();
      
  }

  async getModuloSubModulosByModulo(modulo_id) {

    return await Database.select(
      'm.*',
      ).from('modulos as m')
      .innerJoin(" modulo_submodulos as ms", "ms.modulo_id", "m.id")
      .where("ms.modulo_id", modulo_id)
      .where("m.is_deleted", 0)
      .where("ms.is_deleted", 0)
      .first();
      
  }

  async getPermissionsByModuloAndRole(role_id, modulo_id, page, perPage,filtro) {

    const rolePermission= Database.select(
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
      .where(function(){
        if(filtro!=null && filtro!=undefined){
          this.where("p.name","like",`%${filtro}%`)
        }
      })
      .whereIn("p.id", rolePermission)
      .paginate(page, perPage)

  }

  


}
module.exports = ModuloSubModuloRepository;
