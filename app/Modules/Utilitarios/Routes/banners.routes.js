module.exports = (ApiRoute, Route) => {
  // Rotas públicas (para mobile app e website)
  ApiRoute(() => {
    Route.get("/active", "BannerController.active");
  }, "banners").namespace('App/Modules/Utilitarios/Controllers');

  // Rotas protegidas (para admin)
  ApiRoute(() => {
    Route.get("/", "BannerController.index");
    Route.post("/", "BannerController.store");
    Route.get("/:id", "BannerController.show");
    Route.put("/:id", "BannerController.update");
    Route.delete("/:id", "BannerController.destroy");
    Route.patch("/:id/toggle", "BannerController.toggle");
    Route.post("/reorder", "BannerController.reorder");
  }, "banners")
    .namespace('App/Modules/Utilitarios/Controllers')
    .middleware(["auth"]);
};
