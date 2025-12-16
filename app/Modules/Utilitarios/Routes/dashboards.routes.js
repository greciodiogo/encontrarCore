
    module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
        Route.get("/findDashboardInit", "DashboardController.findDashboardInit");
    }, 'dashboards').namespace('App/Modules/Utilitarios/Controllers').middleware(["auth"]);
