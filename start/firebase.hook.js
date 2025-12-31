'use strict'

/**
 * Este arquivo inicializa Firebase quando a aplicação começa
 * Adicione este código ao seu start/hooks.js ou ao início do start/app.js
 */

const Firebase = require('../config/firebase')

const hook = {
  method: 'boot',
  name: 'firebase',
  async: true,

  handle() {
    try {
      // Inicializar Firebase Admin SDK na inicialização da app
      Firebase.initialize()
      console.log('✓ Firebase inicializado com sucesso')
    } catch (error) {
      console.error('✗ Erro ao inicializar Firebase:', error.message)
      // Não falhar a aplicação se Firebase não inicializar
      // Você pode querer logar e alertar via email neste caso
    }
  }
}

module.exports = hook

/**
 * COMO USAR:
 * 
 * 1. Adicione ao start/hooks.js:
 * 
 *    const firebaseHook = require('./firebase.hook')
 *    
 *    const hooks = [
 *      firebaseHook,
 *      // ... outros hooks
 *    ]
 * 
 * 2. Ou adicione ao start/app.js se quiser que inicie automaticamente
 */
