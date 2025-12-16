module.exports = (ApiRoute, Route) =>
  // Protected routes
  ApiRoute(() => {
    Route.get("getContasByBancos", "ContaBancariaController.findContaBancariasByBancoId");
    Route.get("/", "BancoController.index");
    Route.post("/", "BancoController.store"); //.validator('Banco/storeBanco')
    Route.get("/:id", "BancoController.show");
    Route.put("/:id", "BancoController.update");
    Route.delete("/:id", "BancoController.destroy");

  }, "bancos").namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"]);
