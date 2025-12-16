"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");
class PermissionUserRepository extends BaseStorageRepository {
  constructor() {
    super("PermissionUser", "App/Modules/Security/Acl/Models/");
  }
}
module.exports = PermissionUserRepository;
