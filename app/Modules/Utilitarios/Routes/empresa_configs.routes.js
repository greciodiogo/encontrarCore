module.exports = (ApiRoute, Route) =>
  // Protected routes
  ApiRoute(() => {
    Route.get("/", "EmpresaConfigController.index");
    Route.post("/", "EmpresaConfigController.store")//.validator('EmpresaConfig/created');
    Route.get("/:id", "EmpresaConfigController.show");
    Route.put("/:id", "EmpresaConfigController.update");
    Route.delete("/:id", "EmpresaConfigController.destroy");
    Route.put("/:id", "EmpresaConfigController.upload");
  }, "empresa_configs").namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"]);
