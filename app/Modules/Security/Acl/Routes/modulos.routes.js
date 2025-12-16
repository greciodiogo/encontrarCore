module.exports = (ApiRoute, Route) =>
  // Protected routes
  ApiRoute(() => {
    Route.post("/associarModuloPermissaoAoPerfil", "ModuloController.associarModuloPermissaoAoPerfil");
    Route.get("/", "ModuloController.index");
    Route.post("/", "ModuloController.store");
    Route.get("/:id", "ModuloController.show");
    Route.put("/:id", "ModuloController.update");
    Route.delete("/:id", "ModuloController.destroy");
    
  }, "modulos").namespace('App/Modules/Security/Acl/Controllers').middleware(["auth"]);
