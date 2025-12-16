
    module.exports = (ApiRoute, Route) => 
    // Protected routes
    ApiRoute(() => {
      Route.get("/", "shopController.index");
      Route.post("/", "shopController.store");
      Route.get("/:id", "shopController.show");
      Route.put("/:id", "shopController.update");
      Route.delete("/:id", "shopController.destroy");
    }, 'shops').namespace("App/Modules/Catalog/Controllers")//.middleware(["auth"]);
    