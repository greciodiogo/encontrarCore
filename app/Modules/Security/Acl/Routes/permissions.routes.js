module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {

    Route.get("/getPermissoesAssociadasAoModulo", "PermissionController.getPermissoesAssociadasAoModulo");

    Route.get("/getPermissoesAssociadasARole", "PermissionController.getPermissoesAssociadasARole");
    Route.get("/getPermissoesNaoAssociadasARole", "PermissionController.getPermissoesNaoAssociadasARole");

    Route.get("/", "PermissionController.index")
    Route.post("/", "PermissionController.store");
    Route.get("/:id", "PermissionController.show");
    Route.put("/:id", "PermissionController.update");
    Route.delete("/:id", "PermissionController.destroy");

    Route.post("/attachDetachPermissionsToRole", "PermissionController.attachOrDetachPermissionsToRole");
    Route.post("/attachDetachPermissionsToUser", "PermissionController.attachOrDetachPermissionsToUser");
    Route.get("/getAllPermissionsOfRole/:id", "PermissionController.getAllPermissionsOfRole");
    Route.get("/getAllPermissionsOfRoleModulo/:id", "PermissionController.getAllPermissionsOfRoleModulo");
    Route.get("/getAllPermissionsOfModulo/:id", "PermissionController.getAllPermissionsOfModulo");
    Route.get("/getAllPermissionsOfUser/:id", "PermissionController.getAllPermissionsOfUser");
    Route.post("/attachDetachPermissionsToModulo", "PermissionController.attachOrDetachPermissionsToRole");


  }, "permissions").namespace('App/Modules/Security/Acl/Controllers').middleware(["auth"]);
