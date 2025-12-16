
    module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
        //Route.get("/", "Controller.index");
    }, 'distritos').namespace('App/Modules/Utilitarios/Controllers')//.middleware(["auth"]);
