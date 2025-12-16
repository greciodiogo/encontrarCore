module.exports = (ApiRoute, Route) =>
  // Protected routes
  ApiRoute(() => {
    Route.get("/", "RoleController.index");
    Route.post("/", "RoleController.store");
    Route.get("/:id", "RoleController.show");
    Route.put("/:id", "RoleController.update");
    Route.delete("/:id", "RoleController.destroy");
  }, "roles").namespace('App/Modules/Security/Acl/Controllers').middleware(["auth"]);
