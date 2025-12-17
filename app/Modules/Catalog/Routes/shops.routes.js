
    module.exports = (ApiRoute, Route) => 
    // Protected routes
    ApiRoute(() => {
      Route.get("/", "ShopController.index");
      Route.post("/", "ShopController.store");
      Route.get("/:id", "ShopController.show");
      Route.put("/:id", "ShopController.update");
      Route.delete("/:id", "ShopController.destroy");
    }, 'shops').namespace("App/Modules/Catalog/Controllers")//.middleware(["auth"]);
    