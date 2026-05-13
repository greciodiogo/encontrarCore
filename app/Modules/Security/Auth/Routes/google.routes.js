module.exports = (ApiRoute, Route) => {
  // Public route - não requer autenticação
  ApiRoute(() => {
    Route.post("/google", "GoogleAuthController.googleLogin");
  }, 'auth').namespace("App/Modules/Security/Auth/Controllers");
};
