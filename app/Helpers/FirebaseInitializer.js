'use strict'

/**
 * Firebase Initialization Helper
 * Adicione isto ao seu server.js ou app.js para inicializar Firebase automaticamente
 */

const Firebase = require('./config/firebase')

class FirebaseInitializer {
  /**
   * Inicializa Firebase quando a aplicação inicia
   * Chamado automaticamente pelo AdonisJS
   */
  static initialize() {
    try {
      Firebase.initialize()
      console.log('✓ Firebase Cloud Messaging está pronto')
      return true
    } catch (error) {
      console.error('✗ Erro ao inicializar Firebase:')
      console.error('  ', error.message)
      console.log('')
      console.log('💡 Verifique:')
      console.log('  1. FIREBASE_SERVICE_ACCOUNT está no .env?')
      console.log('  2. JSON está em UMA única linha?')
      console.log('  3. FIREBASE_DATABASE_URL está definido?')
      console.log('')
      
      // Continuar rodando sem Firebase (para desenvolvimento)
      // Em produção, você pode querer falhar aqui
      return false
    }
  }

  /**
   * Verifica se Firebase está configurado corretamente
   */
  static isConfigured() {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    const databaseUrl = process.env.FIREBASE_DATABASE_URL
    
    return !!(serviceAccount && databaseUrl)
  }

  /**
   * Obtém status da configuração Firebase
   */
  static getStatus() {
    const configured = this.isConfigured()
    return {
      configured: configured,
      hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT,
      hasDatabaseUrl: !!process.env.FIREBASE_DATABASE_URL,
      environment: process.env.NODE_ENV
    }
  }

  /**
   * Imprime relatório de configuração
   */
  static printReport() {
    const status = this.getStatus()
    
    console.log('')
    console.log('┌─ FIREBASE CONFIGURATION ─────────────┐')
    console.log(`│ Environment: ${status.environment.padEnd(25)} │`)
    console.log(`│ Service Account: ${status.hasServiceAccount ? '✅' : '❌'.padEnd(20)} │`)
    console.log(`│ Database URL: ${status.hasDatabaseUrl ? '✅' : '❌'.padEnd(22)} │`)
    console.log(`│ Status: ${status.configured ? '✅ READY' : '❌ NOT CONFIGURED'.padEnd(29)} │`)
    console.log('└────────────────────────────────────────┘')
    console.log('')
  }
}

module.exports = FirebaseInitializer

/**
 * COMO USAR:
 * 
 * 1. Em server.js (recomendado):
 * 
 *    const FirebaseInitializer = require('./app/Helpers/FirebaseInitializer')
 *    FirebaseInitializer.initialize()
 *    FirebaseInitializer.printReport()
 *    
 *    // ... resto do código
 * 
 * 2. Em start/hooks.js:
 * 
 *    const FirebaseInitializer = require('../app/Helpers/FirebaseInitializer')
 *    
 *    const hooks = [
 *      {
 *        method: 'boot',
 *        name: 'firebase',
 *        async: false,
 *        handle() {
 *          FirebaseInitializer.initialize()
 *        }
 *      }
 *    ]
 */
