
    module.exports = (ApiRoute, Route) => 
    // Protected routes
    ApiRoute(() => {
      Route.get("/", "usersController.index");
      Route.post("/", "usersController.store")
      Route.get("/:id", "usersController.show");
      Route.put("/:id", "usersController.update");
      Route.delete("/:id", "usersController.destroy");
    }, 'users').namespace("App/Modules/Authentication/Controllers")//.middleware(["auth"]);
    