module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
    Route.get("/", "UserController.index").middleware(['can:listar-utilizadores']);
    Route.post("/", "UserController.store").middleware(['can:criar-utilizadores']);
    Route.get("/:id", "UserController.show").middleware(['can:listar-utilizadores']);
    Route.put("/:id", "UserController.update").middleware(['can:actualizar-utilizadores']);
    Route.delete("/:id", "UserController.destroy").middleware(['can:eliminar-utilizadores']);

    Route.put("/updateStatus/:id", "UserController.updateStatus");
    Route.put("/password/resetByUser/:id","UserController.changePassword");

  }, "users_").namespace('App/Modules/Security/Users/Controllers').middleware(["auth"]);

