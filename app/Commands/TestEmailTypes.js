'use strict'

const { Command } = require('@adonisjs/ace')
const { listEmailTypes } = require('../Config/emailTypes')

class TestEmailTypes extends Command {
  static get signature() {
    return `test:email-types 
    { --email=@value : Email para receber os testes }
    { --type=@value : Testar apenas um tipo específico }`
  }

  static get description() {
    return 'Testar todos os tipos de emails dedicados'
  }

  async handle(args, { email, type }) {
    const testEmail = email || 'fonebahia8@gmail.com'; // Email padrão para testes
    
    this.info('🧪 Testando Emails Dedicados\n');
    this.info(`📧 Enviando para: ${testEmail}\n`);

    const emailService = use('App/Helpers/sendEmail');
    const EnvioEmail = new emailService();

    const types = listEmailTypes();

    // Filtrar por tipo se especificado
    const typesToTest = type 
      ? types.filter(t => t.type === type)
      : types;

    if (typesToTest.length === 0) {
      this.error(`❌ Tipo '${type}' não encontrado`);
      this.info('\nTipos disponíveis:');
      types.forEach(t => this.info(`  - ${t.type}`));
      return;
    }

    this.info(`Testando ${typesToTest.length} tipo(s) de email:\n`);

    for (const typeConfig of typesToTest) {
      try {
        this.info(`📤 Testando: ${typeConfig.type}`);
        this.info(`   De: ${typeConfig.from}`);
        this.info(`   Responder: ${typeConfig.replyTo}`);

        const htmlContent = this.generateTestHTML(typeConfig);

        await EnvioEmail.emailService({
          email: testEmail,
          subject: `[TESTE] ${typeConfig.type.toUpperCase()} - Encontrar`,
          html: htmlContent,
          text: `Teste de email tipo: ${typeConfig.type}`,
          type: typeConfig.type
        });

        this.success(`   ✅ Enviado com sucesso!\n`);

        // Delay de 1 segundo entre emails
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        this.error(`   ❌ Erro: ${error.message}\n`);
      }
    }

    this.info('='.repeat(60));
    this.info('✨ Testes concluídos!');
    this.info('\n💡 Verifique sua caixa de entrada e veja:');
    this.info('   1. Se os emails chegaram');
    this.info('   2. Se o remetente está correto');
    this.info('   3. Se o reply-to está correto');
    this.info('\n📊 Dashboard Resend: https://resend.com/emails');
  }

  generateTestHTML(typeConfig) {
    return `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste Email - ${typeConfig.type}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #DC9E00 0%, #FDB913 100%); padding: 30px 20px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                🧪 TESTE DE EMAIL
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                                Tipo: ${typeConfig.type.toUpperCase()}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Conteúdo -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #DC9E00; font-size: 22px;">
                                Informações do Email
                            </h2>
                            
                            <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #eeeeee; border-radius: 5px;">
                                <tr style="background-color: #f8f8f8;">
                                    <td style="font-weight: bold; color: #333333;">Tipo:</td>
                                    <td style="color: #666666;">${typeConfig.type}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold; color: #333333;">Remetente:</td>
                                    <td style="color: #666666;">${typeConfig.from}</td>
                                </tr>
                                <tr style="background-color: #f8f8f8;">
                                    <td style="font-weight: bold; color: #333333;">Responder para:</td>
                                    <td style="color: #666666;">${typeConfig.replyTo}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold; color: #333333;">Descrição:</td>
                                    <td style="color: #666666;">${typeConfig.description}</td>
                                </tr>
                            </table>
                            
                            <div style="margin-top: 30px; padding: 20px; background-color: #FFF8E1; border-left: 4px solid #DC9E00; border-radius: 5px;">
                                <h3 style="margin: 0 0 10px 0; color: #DC9E00; font-size: 18px;">
                                    📋 Exemplos de Uso:
                                </h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666666;">
                                    ${typeConfig.examples.map(ex => `<li>${ex}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <div style="margin-top: 30px; padding: 20px; background-color: #E8F5E9; border-radius: 5px; text-align: center;">
                                <p style="margin: 0; color: #2E7D32; font-size: 16px; font-weight: bold;">
                                    ✅ Se você recebeu este email, o sistema está funcionando corretamente!
                                </p>
                            </div>
                            
                            <div style="margin-top: 20px; padding: 15px; background-color: #FFF3E0; border-radius: 5px;">
                                <p style="margin: 0; color: #E65100; font-size: 14px;">
                                    <strong>💡 Dica:</strong> Tente responder a este email e veja para onde vai a resposta!
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f8f8f8; padding: 20px;">
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                Este é um email de teste do sistema Encontrar<br/>
                                Enviado via Resend com emails dedicados
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
  }
}

module.exports = TestEmailTypes
