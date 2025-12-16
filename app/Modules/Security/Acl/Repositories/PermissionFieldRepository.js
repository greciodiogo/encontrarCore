"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");

class PermissionFieldRepository extends BaseStorageRepository {
  
  constructor(connection = 'mysql') {
    super("PermissionField", "App/Modules/Security/Acl/Models/", connection);
  }

}
module.exports = PermissionFieldRepository;
