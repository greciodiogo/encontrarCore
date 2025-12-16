module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
    Route.get("/", "MoedaController.index");
    Route.post("/", "MoedaController.store");
    Route.get("/:id", "MoedaController.show");
    Route.put("/:id", "MoedaController.update");
    Route.delete("/:id", "MoedaController.destroy");
  }, "moedas").namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"]);
