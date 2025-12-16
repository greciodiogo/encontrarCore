"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");
class RoleRepository extends BaseStorageRepository {
  constructor(connection = 'mysql') {
    super("Role", "App/Modules/Security/Acl/Models/",connection);
  }
}
module.exports = RoleRepository;
