
    module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
      Route.get("/", "OrganismoController.index");
      Route.post("/", "OrganismoController.store");
      Route.get("/:organismo_id", "OrganismoController.findById");
      Route.put("/:organismo_id", "OrganismoController.edit");
      Route.get('/byNome/:nome', 'OrganismoController.findByNome')
      Route.delete("/:organismo_id", "OrganismoController.destroy");
    }, 'organismos').namespace("App/Modules/Utilitarios/Controllers").middleware(["auth"]);
