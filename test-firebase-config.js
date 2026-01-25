/**
 * Script para testar a configuração do Firebase
 * Execute: node test-firebase-config.js
 */

require('dotenv').config()

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT

console.log('\n🔍 VALIDAÇÃO DA CONFIGURAÇÃO FIREBASE\n')
console.log('=' .repeat(60))

if (!serviceAccountJson) {
  console.error('❌ FIREBASE_SERVICE_ACCOUNT não encontrado no .env')
  process.exit(1)
}

try {
  const serviceAccount = JSON.parse(serviceAccountJson)
  
  console.log('✅ JSON parseado com sucesso\n')
  
  console.log('📋 Informações do Projeto:')
  console.log(`   Project ID: ${serviceAccount.project_id}`)
  console.log(`   Client Email: ${serviceAccount.client_email}`)
  console.log(`   Private Key ID: ${serviceAccount.private_key_id}`)
  console.log(`   Private Key: ${serviceAccount.private_key ? '✓ Presente' : '✗ Ausente'}`)
  console.log(`   Private Key Length: ${serviceAccount.private_key ? serviceAccount.private_key.length : 0} caracteres`)
  
  console.log('\n📱 Validação com google-services.json:')
  console.log('   Verifique se o project_id acima corresponde ao do arquivo:')
  console.log('   - Android: encontrar-mobile-app/android/app/google-services.json')
  console.log('   - iOS: encontrar-mobile-app/ios/GoogleService-Info.plist')
  
  console.log('\n🔑 Campos Obrigatórios:')
  const requiredFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email', 'client_id']
  requiredFields.forEach(field => {
    const present = !!serviceAccount[field]
    console.log(`   ${present ? '✓' : '✗'} ${field}: ${present ? 'OK' : 'FALTANDO'}`)
  })
  
  // Validar formato da private key
  if (serviceAccount.private_key) {
    const hasBeginMarker = serviceAccount.private_key.includes('-----BEGIN PRIVATE KEY-----')
    const hasEndMarker = serviceAccount.private_key.includes('-----END PRIVATE KEY-----')
    const hasNewlines = serviceAccount.private_key.includes('\\n')
    
    console.log('\n🔐 Validação da Private Key:')
    console.log(`   ${hasBeginMarker ? '✓' : '✗'} Contém BEGIN marker`)
    console.log(`   ${hasEndMarker ? '✓' : '✗'} Contém END marker`)
    console.log(`   ${hasNewlines ? '✓' : '✗'} Contém newlines (\\n)`)
    
    if (!hasBeginMarker || !hasEndMarker || !hasNewlines) {
      console.log('\n   ⚠️  A private key pode estar malformada')
    }
  }
  
  console.log('\n' + '=' .repeat(60))
  console.log('✅ Configuração parece válida!')
  console.log('\n💡 Próximos passos:')
  console.log('   1. Inicie o servidor: npm start ou node ace serve --dev')
  console.log('   2. Faça login no app mobile')
  console.log('   3. Teste com: POST /api/notifications/test/send-to-me')
  console.log('   4. Ou veja seus tokens: GET /api/notifications/test/my-tokens')
  console.log('')
  
} catch (error) {
  console.error('❌ Erro ao parsear FIREBASE_SERVICE_ACCOUNT:', error.message)
  console.error('\n💡 Dica: Verifique se o JSON está corretamente formatado no .env')
  process.exit(1)
}
