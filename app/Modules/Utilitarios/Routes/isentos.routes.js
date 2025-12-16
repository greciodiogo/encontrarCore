
    module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
      Route.get("/", "IsentoController.index");
      Route.post("/", "IsentoController.store");
      Route.get("/:id", "IsentoController.show");
      Route.put("/:id", "IsentoController.update");
      Route.delete("/:id", "IsentoController.destroy");
    }, 'isentos').namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"]);
    