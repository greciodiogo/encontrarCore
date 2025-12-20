
    module.exports = (ApiRoute, Route) => 
    // Protected routes
    ApiRoute(() => {
      Route.get("/products/shop", "AdminController.getProductsByShop");
      Route.get("/shop/info", "AdminController.getProductsByShop");
    }, 'admin').namespace("App/Modules/Admin/Controllers").middleware(["auth"]);
    