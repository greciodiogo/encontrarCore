module.exports = (ApiRoute, Route) =>
  // Protected routes
  ApiRoute(() => {
    Route.get("/", "CambioController.index");
    Route.post("/", "CambioController.store"); //.validator('Cambio/storeCambio')
    Route.get("/:id", "CambioController.show");
    Route.put("/:id", "CambioController.update");
    Route.delete("/:id", "CambioController.destroy");
  }, "cambios").namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"]);
