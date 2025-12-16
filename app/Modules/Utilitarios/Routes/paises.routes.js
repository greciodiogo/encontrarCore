module.exports = (ApiRoute, Route) =>
  // Protected routes
  ApiRoute(() => {
    Route.get("/", "PaisController.index");
    Route.post("/", "PaisController.store");
    Route.get("/:id", "PaisController.show");
    Route.put("/:id", "PaisController.update");
    Route.delete("/:id", "PaisController.destroy");
  }, "paises").namespace('App/Modules/Utilitarios/Controllers');
