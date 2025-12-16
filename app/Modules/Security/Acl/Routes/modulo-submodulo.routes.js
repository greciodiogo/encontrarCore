module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
    Route.get("/", "ModuloSubModuloController.index")
    Route.post("/", "ModuloSubModuloController.store");
    Route.get("/:id", "ModuloSubModuloController.show");
    Route.put("/:id", "ModuloSubModuloController.update");
    Route.delete("/:id", "ModuloSubModuloController.destroy");

    Route.post("/attachOrDetachSubModulosToModulo", "ModuloSubModuloController.attachOrDetachSubModulosToModulo");

  }, "modulo-submodulo").namespace('App/Modules/Security/Acl/Controllers').middleware(["auth"]);
