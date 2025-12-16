module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
    Route.get("/", "ProvinciaController.index");
    Route.post("/", "ProvinciaController.store");
    Route.get("/:id", "ProvinciaController.show");
    Route.put("/:id", "ProvinciaController.update");
    Route.delete("/:id", "ProvinciaController.destroy");
  }, "provincia").namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"]);
