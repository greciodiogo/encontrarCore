"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");
const Database = use('Database')

class PermissionRoleRepository extends BaseStorageRepository {
  constructor() {
    super("PermissionRole", "App/Modules/Security/Acl/Models/");
  }

  
}
module.exports = PermissionRoleRepository;
