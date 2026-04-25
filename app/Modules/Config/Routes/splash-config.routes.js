'use strict';

/**
 * Rotas de configuração do splash screen
 */
module.exports = function (ApiRoute, Route) {
  // Grupo de rotas de configuração
  ApiRoute.group(() => {
    // Obter configuração da animação de splash
    Route.get('/splash-animation', 'SplashConfigController.getSplashAnimation');
    
    // Upload de nova animação (futuro - dashboard)
    Route.post('/splash-animation/upload', 'SplashConfigController.uploadAnimation')
      .middleware(['auth']); // Requer autenticação
  }).prefix('/config');

  // Rota para servir arquivos de animação
  Route.get('/static/animations/:filename', 'SplashConfigController.serveAnimation');
};
