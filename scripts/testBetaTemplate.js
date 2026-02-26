const betaTestInviteTemplate = require('../app/Templates/email/betaTestInviteTemplate');
const fs = require('fs');
const path = require('path');

// Converter logo para base64
const logoPath = path.join(__dirname, '../assets/logo-encontrar.png');
let logoBase64 = '';

try {
  const logoBuffer = fs.readFileSync(logoPath);
  logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  console.log('✅ Logo carregado com sucesso!\n');
} catch (error) {
  console.log('⚠️  Logo não encontrado, usando URL padrão\n');
}

// Gerar HTML do template
const userName = 'Fonebahia';
const htmlContent = betaTestInviteTemplate(userName, logoBase64);

// Salvar em arquivo HTML para visualizar no browser
const outputPath = path.join(__dirname, 'beta-invite-preview.html');
fs.writeFileSync(outputPath, htmlContent);

console.log('✅ Template gerado com sucesso!');
console.log(`📄 Arquivo salvo em: ${outputPath}`);
console.log('\n🌐 Para visualizar:');
console.log(`   open ${outputPath}`);
console.log('\nOu abra o arquivo manualmente no browser.\n');

// Abrir automaticamente no browser (macOS)
const { exec } = require('child_process');
exec(`open "${outputPath}"`, (error) => {
  if (error) {
    console.log('💡 Abra o arquivo manualmente no browser para visualizar o template.\n');
  } else {
    console.log('🚀 Abrindo no browser...\n');
  }
});
