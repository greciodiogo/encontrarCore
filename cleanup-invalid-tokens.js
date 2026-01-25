/**
 * Script para limpar tokens FCM inválidos do banco de dados
 * Execute: node cleanup-invalid-tokens.js
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

async function cleanupInvalidTokens() {
  console.log('\n🧹 LIMPEZA DE TOKENS INVÁLIDOS\n')
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
    
    console.log(`   ✓ Firebase inicializado`)
    
    // 2. Buscar todos os tokens ativos
    console.log('\n2️⃣  Buscando tokens ativos...')
    const tokens = await knex('device_tokens')
      .where('is_active', true)
      .select('*')
      .orderBy('created_at', 'desc')
    
    console.log(`   ✓ Encontrados ${tokens.length} token(s) ativo(s)`)
    
    if (tokens.length === 0) {
      console.log('\n   ℹ️  Nenhum token para validar')
      process.exit(0)
    }
    
    // 3. Validar cada token
    console.log('\n3️⃣  Validando tokens...')
    
    let validCount = 0
    let invalidCount = 0
    const invalidTokenIds = []
    
    for (const tokenData of tokens) {
      try {
        // Tentar enviar uma mensagem de teste (dry run)
        const message = {
          token: tokenData.token,
          notification: {
            title: 'Test',
            body: 'Test'
          },
          data: {
            test: 'true'
          }
        }
        
        // Validar token sem enviar (dry run)
        await admin.messaging().send(message, true)
        
        console.log(`   ✓ Token válido: User ${tokenData.user_id} (${tokenData.device_name})`)
        validCount++
        
      } catch (error) {
        console.log(`   ✗ Token inválido: User ${tokenData.user_id} (${tokenData.device_name})`)
        console.log(`     Erro: ${error.message}`)
        invalidCount++
        invalidTokenIds.push(tokenData.id)
      }
    }
    
    // 4. Desativar tokens inválidos
    if (invalidTokenIds.length > 0) {
      console.log(`\n4️⃣  Desativando ${invalidTokenIds.length} token(s) inválido(s)...`)
      
      await knex('device_tokens')
        .whereIn('id', invalidTokenIds)
        .update({
          is_active: false,
          updated_at: new Date()
        })
      
      console.log(`   ✓ Tokens desativados com sucesso`)
    } else {
      console.log(`\n4️⃣  Nenhum token inválido encontrado`)
    }
    
    // 5. Resumo
    console.log('\n' + '=' .repeat(60))
    console.log('📊 RESUMO:')
    console.log(`   Total de tokens: ${tokens.length}`)
    console.log(`   ✓ Válidos: ${validCount}`)
    console.log(`   ✗ Inválidos: ${invalidCount}`)
    console.log(`   🗑️  Desativados: ${invalidTokenIds.length}`)
    
    if (validCount > 0) {
      console.log(`\n✅ ${validCount} token(s) válido(s) permanece(m) ativo(s)`)
    }
    
    if (invalidCount > 0) {
      console.log(`\n🧹 ${invalidCount} token(s) inválido(s) foi(ram) desativado(s)`)
      console.log('   💡 Usuários precisarão fazer login novamente para registrar novos tokens')
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

// Executar limpeza
cleanupInvalidTokens()
