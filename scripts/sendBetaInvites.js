const sendEmail = require('../app/Helpers/sendEmail');
const betaTestInviteTemplate = require('../app/Templates/email/betaTestInviteTemplate');
const fs = require('fs');
const path = require('path');

// Carregar logo em base64
const logoPath = path.join(__dirname, '../assets/logo-encontrar.png');
let logoBase64 = '';

try {
  const logoBuffer = fs.readFileSync(logoPath);
  logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
} catch (error) {
  console.log('⚠️  Logo não encontrado, usando URL padrão');
}

// Lista de emails dos beta testers
const betaTesters = [
  'alfeubena@gmail.com',
  'anamoxi29@gmail.com',
  'antoniajunior22@gmail.com',
  'encontrarmarketing@gmail.com',
  'esuakiliu@gmail.com',
  'felixsunda@gmail.com',
  'fonebahia8@gmail.com',
  'grandemercado347@gmail.com',
  'habomghirmay@gmail.com',
  'igorteca29@gmail.com',
  'kappaluis18@gmail.com',
  'luciogrillo4@gmail.com',
  'manuelteca22@gmail.com',
  'miezempata22@gmail.com',
  'nahomsolomon154@gmail.com',
  'rosariadafonseca177@gmail.com',
  'samitagasha@gmail.com',
  'samuelgashazghi@gmail.com',
  'surafiel.ceo@gmail.com',
  'surafiel66@gmail.com',
  'vitalview16@gmail.com',
  'walterpereiradossantos1@gmail.com',
  'winniedossantos7@gmail.com'
];

// Função para extrair nome do email (opcional)
function extractNameFromEmail(email) {
  const username = email.split('@')[0];
  // Capitalizar primeira letra
  return username.charAt(0).toUpperCase() + username.slice(1);
}

// Função para enviar email com delay
async function sendEmailWithDelay(email, delay) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const userName = extractNameFromEmail(email);
        const htmlContent = betaTestInviteTemplate(userName, logoBase64);
        
        await sendEmail({
          to: email,
          subject: '🎉 Acesso Exclusivo: Teste a Nova App Encontrar Antes do Lançamento',
          html: htmlContent
        });
        
        console.log(`✅ Email enviado para: ${email}`);
        resolve({ success: true, email });
      } catch (error) {
        console.error(`❌ Erro ao enviar para ${email}:`, error.message);
        resolve({ success: false, email, error: error.message });
      }
    }, delay);
  });
}

// Função principal
async function sendBetaInvites() {
  console.log('🚀 Iniciando envio de convites para beta testers...\n');
  console.log(`📧 Total de emails: ${betaTesters.length}\n`);
  
  const results = [];
  
  // Enviar emails com delay de 2 segundos entre cada um
  // para evitar rate limiting
  for (let i = 0; i < betaTesters.length; i++) {
    const email = betaTesters[i];
    const delay = i * 2000; // 2 segundos entre cada email
    
    console.log(`📤 [${i + 1}/${betaTesters.length}] Agendando envio para: ${email}`);
    const result = await sendEmailWithDelay(email, delay);
    results.push(result);
  }
  
  // Aguardar todos os emails serem enviados
  await new Promise(resolve => setTimeout(resolve, betaTesters.length * 2000 + 5000));
  
  // Resumo
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DO ENVIO');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Enviados com sucesso: ${successful}`);
  console.log(`❌ Falhas: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ Emails que falharam:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.email}: ${r.error}`);
    });
  }
  
  console.log('\n✨ Processo concluído!');
  process.exit(0);
}

// Executar
sendBetaInvites().catch(error => {
  console.error('💥 Erro fatal:', error);
  process.exit(1);
});
