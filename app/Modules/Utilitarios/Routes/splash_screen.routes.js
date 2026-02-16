module.exports = (ApiRoute, Route) => {
  // Rotas públicas (para mobile app)
  ApiRoute(() => {
    Route.get("/active", "SplashScreenController.active");
  }, "splash-screens").namespace('App/Modules/Utilitarios/Controllers');

  // Rotas protegidas (para admin)
  ApiRoute(() => {
    Route.get("/", "SplashScreenController.index");
    Route.post("/", "SplashScreenController.store");
    Route.get("/:id", "SplashScreenController.show");
    Route.put("/:id", "SplashScreenController.update");
    Route.delete("/:id", "SplashScreenController.destroy");
    Route.patch("/:id/toggle", "SplashScreenController.toggle");
    Route.post("/reorder", "SplashScreenController.reorder");
  }, "splash-screens")
    .namespace('App/Modules/Utilitarios/Controllers')
    .middleware(["auth"]);
};
