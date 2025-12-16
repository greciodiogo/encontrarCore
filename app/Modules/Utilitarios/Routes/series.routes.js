module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
    Route.get("/", "SerieController.index");
    Route.get("/findSeriesRecibosNotInLojas", "SerieController.findSeriesRecibosNotInLojas");
    Route.get("/findSeriesNotInLojas", "SerieController.findSeriesNotInLojas");
    Route.get("/findEstadoSerieById/:id", "SerieController.findEstadoSerieById");
    Route.post("/", "SerieController.store")//.validator('Serie/created')
    Route.get("/:id", "SerieController.show");
    Route.put("/:id", "SerieController.update");
    Route.delete("/:id", "SerieController.destroy");
  }, "series").namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"]);
