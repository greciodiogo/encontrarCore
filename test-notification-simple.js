/**
 * Script simples para testar notificações push
 * Execute: node test-notification-simple.js
 * 
 * Este script:
 * 1. Inicializa o Firebase
 * 2. Busca tokens de um usuário
 * 3. Envia uma notificação de teste
 */

require('dotenv').config()
const admin = require('firebase-admin')

// Configuração do banco de dados
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  }
})

async function testNotification() {
  console.log('\n🔔 TESTE DE NOTIFICAÇÃO PUSH\n')
  console.log('=' .repeat(60))
  
  try {
    // 1. Inicializar Firebase
    console.log('\n1️⃣  Inicializando Firebase...')
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT
    
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT não encontrado no .env')
    }
    
    const serviceAccount = JSON.parse(serviceAccountJson)
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    })
    
    console.log(`   ✓ Firebase inicializado (Project: ${serviceAccount.project_id})`)
    
    // 2. Buscar tokens ativos
    console.log('\n2️⃣  Buscando tokens ativos...')
    const tokens = await knex('device_tokens')
      .where('is_active', true)
      .select('*')
      .orderBy('created_at', 'desc')
    
    console.log(`   ✓ Encontrados ${tokens.length} token(s) ativo(s)`)
    
    if (tokens.length === 0) {
      console.log('\n   ⚠️  Nenhum token encontrado!')
      console.log('   💡 Faça login no app mobile primeiro')
      console.log('   💡 O app deve registrar o token automaticamente após login')
      process.exit(0)
    }
    
    // Mostrar informações dos tokens
    console.log('\n   📱 Tokens encontrados:')
    tokens.forEach((token, index) => {
      console.log(`      ${index + 1}. User ID: ${token.user_id} | Device: ${token.device_name} | Type: ${token.device_type}`)
      console.log(`         Token: ${token.token.substring(0, 40)}...`)
      console.log(`         Criado: ${token.created_at}`)
    })
    
    // 3. Enviar notificação de teste
    console.log('\n3️⃣  Enviando notificação de teste...')
    
    const notification = {
      title: '🎉 Teste de Notificação',
      body: 'Se você está vendo isso, as notificações estão funcionando!'
    }
    
    const data = {
      type: 'test',
      timestamp: new Date().toISOString(),
      source: 'test-script'
    }
    
    let successCount = 0
    let failureCount = 0
    const results = []
    
    for (const tokenData of tokens) {
      try {
        console.log(`\n   📤 Enviando para User ID ${tokenData.user_id} (${tokenData.device_name})...`)
        
        const message = {
          notification: {
            title: notification.title,
            body: notification.body
          },
          data: data,
          token: tokenData.token,
          android: {
            priority: 'high',
            notification: {
              sound: 'default',
              clickAction: 'FLUTTER_NOTIFICATION_CLICK'
            }
          },
          apns: {
            headers: {
              'apns-priority': '10'
            },
            payload: {
              aps: {
                sound: 'default',
                badge: 1
              }
            }
          }
        }
        
        const result = await admin.messaging().send(message)
        console.log(`      ✓ Sucesso! Message ID: ${result}`)
        successCount++
        results.push({
          userId: tokenData.user_id,
          device: tokenData.device_name,
          success: true,
          messageId: result
        })
      } catch (error) {
        console.log(`      ✗ Falha: ${error.message}`)
        failureCount++
        results.push({
          userId: tokenData.user_id,
          device: tokenData.device_name,
          success: false,
          error: error.message
        })
        
        // Diagnóstico
        if (error.message.includes('SenderId mismatch')) {
          console.log(`      🔍 DIAGNÓSTICO: Token foi gerado com projeto Firebase diferente`)
          console.log(`         - Backend usa: ${serviceAccount.project_id}`)
          console.log(`         - Verifique google-services.json no app mobile`)
          console.log(`         - Desinstale e reinstale o app para gerar novo token`)
        } else if (error.message.includes('registration-token-not-registered')) {
          console.log(`      🔍 DIAGNÓSTICO: Token expirado ou app desinstalado`)
          console.log(`         - Reinstale o app e faça login novamente`)
        } else if (error.message.includes('invalid-argument')) {
          console.log(`      🔍 DIAGNÓSTICO: Token inválido ou malformado`)
          console.log(`         - Token pode estar corrompido no banco`)
        }
      }
    }
    
    // 4. Resumo
    console.log('\n' + '=' .repeat(60))
    console.log('📊 RESUMO:')
    console.log(`   Total de tokens: ${tokens.length}`)
    console.log(`   ✓ Sucesso: ${successCount}`)
    console.log(`   ✗ Falhas: ${failureCount}`)
    
    if (successCount > 0) {
      console.log('\n🎉 SUCESSO! Verifique o dispositivo para ver a notificação.')
      console.log('\n✅ Dispositivos que receberam:')
      results.filter(r => r.success).forEach(r => {
        console.log(`   - User ${r.userId}: ${r.device}`)
      })
    }
    
    if (failureCount > 0) {
      console.log('\n❌ Dispositivos com falha:')
      results.filter(r => !r.success).forEach(r => {
        console.log(`   - User ${r.userId}: ${r.device}`)
        console.log(`     Erro: ${r.error}`)
      })
    }
    
    console.log('\n💡 Próximos passos:')
    if (successCount > 0) {
      console.log('   1. Verifique se a notificação apareceu no dispositivo')
      console.log('   2. Teste via API: POST /api/notifications/test/send-to-me')
      console.log('   3. Integre notificações nos fluxos do app (pedidos, etc)')
    } else {
      console.log('   1. Verifique os erros acima')
      console.log('   2. Confirme que o app mobile está usando o google-services.json correto')
      console.log('   3. Reinstale o app e faça login novamente')
      console.log('   4. Execute: node test-firebase-config.js para validar configuração')
    }
    
    console.log('')
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message)
    console.error(error.stack)
  } finally {
    await knex.destroy()
    process.exit(0)
  }
}

// Executar teste
testNotification()
