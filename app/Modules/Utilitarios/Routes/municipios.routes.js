
    module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
        //Route.get("/", "Controller.index");
    }, 'municipios').namespace('App/Modules/Utilitarios/Controllers')//.middleware(["auth"]);
