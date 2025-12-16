module.exports = (ApiRoute, Route) =>
  ApiRoute(() => {
    Route.get("/", "ParametroGeralController.index");
    Route.post("/", "ParametroGeralController.store")
    Route.get("/:id", "ParametroGeralController.show");
    Route.put("/:id", "ParametroGeralController.update");
    Route.delete("/:id", "ParametroGeralController.destroy");
  }, "parametro_geral").namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"]);
