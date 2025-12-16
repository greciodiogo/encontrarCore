module.exports = (ApiRoute, Route) =>
    ApiRoute(() => {
    Route.get("/", "GraficaController.index");
    Route.post("/", "GraficaController.store");
    Route.get("/:id", "GraficaController.show");
    Route.put("/:id", "GraficaController.edit");
    Route.delete("/:id", "GraficaController.destroy");
  }, "grafica").namespace('App/Modules/Aprovisionamento/Controllers').middleware(["auth"]);
