module.exports = (ApiRoute, Route) =>
  // Protected routes
  ApiRoute(() => {
    Route.get("/getTypesClient", "FormController.getTypesClient");
    Route.get("/getTypesClientBySlug", "FormController.getTypesClientBySlug");
 
}, "form").namespace("App/Modules/Utilitarios/Controllers");
