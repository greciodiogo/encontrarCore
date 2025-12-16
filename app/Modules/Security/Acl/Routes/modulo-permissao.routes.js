module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
    Route.get("/", "ModuloPermissaoController.index")
    Route.post("/", "ModuloPermissaoController.store");
    Route.get("/:id", "ModuloPermissaoController.show");
    Route.put("/:id", "ModuloPermissaoController.update");
    Route.delete("/:id", "ModuloPermissaoController.destroy");

    Route.post("/attachDetachPermissionsToModulo", "ModuloPermissaoController.attachOrDetachPermissionsToModulo");

  }, "modulo-permissao").namespace('App/Modules/Security/Acl/Controllers').middleware(["auth"]);
