module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {

    Route.get("/", "PermissionFieldController.index")
    Route.post("/", "PermissionFieldController.store");
    Route.get("/:id", "PermissionFieldController.show");
    Route.put("/:id", "PermissionFieldController.update");
    Route.delete("/:id", "PermissionFieldController.destroy");

  }, "permission_fields").namespace('App/Modules/Security/Acl/Controllers').middleware(["auth"]);
