    module.exports = (ApiRoute, Route) => 
    // Protected routes
    ApiRoute(() => {
      Route.get("/", "UsersController.index");
      Route.post("/", "UsersController.store");
      Route.get("/:id", "UsersController.show");
      Route.put("/:id", "UsersController.update");
      Route.delete("/:id", "UsersController.destroy");
      Route.post("/:id/profile-photo", "UsersController.uploadProfilePhoto");
    }, 'users').namespace("App/Modules/Authentication/Controllers").middleware(["auth"]);
    