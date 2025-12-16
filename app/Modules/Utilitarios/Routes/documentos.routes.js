module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
    Route.get("/", "DocumentoController.index");
    Route.post("/", "DocumentoController.store")//.validator('Documento/created');
    Route.get("/:id", "DocumentoController.show");
    Route.put("/:id", "DocumentoController.update");
    Route.delete("/:id", "DocumentoController.destroy");
  }, "documentos").namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"]);
