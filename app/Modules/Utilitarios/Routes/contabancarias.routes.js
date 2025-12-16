module.exports = (ApiRoute, Route) =>
  // Protected routes
  ApiRoute(() => {
    Route.get("getTpaByContaBancariaId", "TpaController.findTpaByContaBancariaId");
    Route.get("/", "ContaBancariaController.index");
    Route.post("/", "ContaBancariaController.store"); //.validator('Banco/storeBanco')
    Route.get("/:id", "ContaBancariaController.show");
    Route.put("/:id", "ContaBancariaController.update");
    Route.delete("/:id", "ContaBancariaController.destroy");
  }, "ContaBancarias").namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"]);
