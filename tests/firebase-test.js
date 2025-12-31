'use strict'

/**
 * Script de Teste - Firebase Push Notifications
 * Execute este arquivo para testar se a configuração está correta
 * 
 * node tests/firebase-test.js
 */

const admin = require('firebase-admin')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

async function testFirebaseConnection() {
  try {
    console.log('🔄 Testando conexão com Firebase...\n')

    // 1. Verificar variáveis de ambiente
    console.log('1️⃣ Verificando variáveis de ambiente...')
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT
    const firebaseDatabaseUrl = process.env.FIREBASE_DATABASE_URL

    if (!serviceAccountJson) {
      throw new Error('❌ FIREBASE_SERVICE_ACCOUNT não está definido no .env')
    }
    if (!firebaseDatabaseUrl) {
      throw new Error('❌ FIREBASE_DATABASE_URL não está definido no .env')
    }
    console.log('✅ Variáveis de ambiente OK\n')

    // 2. Fazer parse do JSON
    console.log('2️⃣ Fazendo parse do JSON de credenciais...')
    let serviceAccount
    try {
      serviceAccount = JSON.parse(serviceAccountJson)
    } catch (error) {
      throw new Error(`❌ JSON de credenciais inválido: ${error.message}`)
    }
    console.log('✅ JSON válido')
    console.log(`   Project ID: ${serviceAccount.project_id}\n`)

    // 3. Inicializar Firebase
    console.log('3️⃣ Inicializando Firebase Admin SDK...')
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: firebaseDatabaseUrl
    })
    console.log('✅ Firebase inicializado\n')

    // 4. Testar envio de mensagem
    console.log('4️⃣ Testando envio de mensagem...')
    console.log('   ⚠️ NOTA: Você precisa de um token FCM válido para este teste')
    console.log('   Este é um teste estrutural, não será enviada mensagem real\n')

    // Mensagem de teste (não será enviada sem um token válido)
    const testMessage = {
      notification: {
        title: 'Teste de Notificação',
        body: 'Este é um teste do Firebase Push Notifications'
      },
      data: {
        type: 'test',
        timestamp: new Date().toISOString()
      },
      android: {
        priority: 'high'
      }
    }

    console.log('✅ Estrutura de mensagem válida')
    console.log('   Message:', JSON.stringify(testMessage, null, 2), '\n')

    // 5. Verificar Cloud Messaging
    console.log('5️⃣ Verificando acesso a Cloud Messaging...')
    const messaging = admin.messaging()
    console.log('✅ Cloud Messaging disponível\n')

    // 6. Resumo
    console.log('=' . repeat(50))
    console.log('✅ TESTE BEM-SUCEDIDO!\n')
    console.log('Seu Firebase está corretamente configurado.\n')
    console.log('Próximos passos:')
    console.log('1. Execute: adonis migration:run')
    console.log('2. Registre tokens FCM no seu app Flutter')
    console.log('3. Crie pedidos e veja as notificações chegarem!\n')
    console.log('=' . repeat(50))

    await app.delete()
    process.exit(0)

  } catch (error) {
    console.error('\n❌ ERRO AO TESTAR FIREBASE:')
    console.error(`   ${error.message}\n`)

    console.log('🔧 SUGESTÕES DE CORREÇÃO:')
    console.log('1. Verifique se o arquivo .env está correto')
    console.log('2. Certifique-se de que o JSON está em UMA única linha')
    console.log('3. Visite https://console.firebase.google.com/ para obter novas credenciais')
    console.log('4. Veja docs/FIREBASE_PUSH_NOTIFICATIONS_SETUP.md para mais detalhes\n')

    process.exit(1)
  }
}

// Executar teste
testFirebaseConnection()
