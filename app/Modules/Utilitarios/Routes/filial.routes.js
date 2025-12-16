
    module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
        //Route.get("/", "Controller.index");
        Route.post('/', 'FilialController.store').validator('createFilial')
        Route.get('/', 'FilialController.index')
        Route.get('/:filial_id', 'FilialController.findById')
        Route.put("/:filial_id", "FilialController.edit")
    }, 'filial').namespace("App/Modules/Utilitarios/Controllers").middleware(["auth"]);
