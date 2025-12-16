
    module.exports = (ApiRoute, Route) => 
    // Protected routes
    ApiRoute(() => {
      Route.get("/", "productsController.index");
      Route.post("/", "productsController.store");
      Route.get("/:id", "productsController.show");
      Route.put("/:id", "productsController.update");
      Route.delete("/:id", "productsController.destroy");
    }, 'products').namespace("App/Modules/Catalog/Controllers")//.middleware(["auth"]);
    