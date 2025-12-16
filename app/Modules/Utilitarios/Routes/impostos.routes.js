module.exports = (ApiRoute, Route) =>
  // Protected routes
  ApiRoute(() => {
    Route.get("/", "ImpostoController.index");
    Route.post("/", "ImpostoController.store");
    Route.get("/:id", "ImpostoController.show");
    Route.put("/:id", "ImpostoController.update");
    Route.delete("/:id", "ImpostoController.destroy");
  }, "impostos").namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"])
