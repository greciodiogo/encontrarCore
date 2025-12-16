module.exports = (ApiRoute, Route) =>
  // Protected routes
  ApiRoute(() => {
    Route.get("/", "TpaController.index");
    Route.post("/", "TpaController.store"); //.validator('Banco/storeBanco')
    Route.get("/:id", "TpaController.show"); 
    Route.put("transferirTpa/:id", "TpaController.transferirTpa");
    Route.put("/:id", "TpaController.update");
    Route.delete("/:id", "TpaController.destroy");
  }, "tpas").namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"]);
