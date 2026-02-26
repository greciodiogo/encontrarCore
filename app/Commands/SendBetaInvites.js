'use strict'

const { Command } = require('@adonisjs/ace')
const betaTestInviteTemplate = require('../Templates/email/betaTestInviteTemplate')
const fs = require('fs')
const path = require('path')
const EnvioEmail = require('../Helpers/sendEmail')

class SendBetaInvites extends Command {
  static get signature() {
    return 'send:beta-invites'
  }

  static get description() {
    return 'Enviar convites de beta test para a lista de testers'
  }

  async handle(args, options) {
    this.info('🚀 Iniciando envio de convites para beta testers...\n')

    // Carregar logo em base64
    const logoPath = path.join(__dirname, '../../assets/logo-encontrar.png')
    let logoBase64 = ''
    
    try {
      const logoBuffer = fs.readFileSync(logoPath)
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`
      this.success('✅ Logo carregado com sucesso!\n')
    } catch (error) {
      this.warn('⚠️  Logo não encontrado, usando URL padrão\n')
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
    ]

    this.info(`📧 Total de emails: ${betaTesters.length}\n`)

    const results = []
    let successCount = 0
    let failCount = 0
    
    const emailService = new EnvioEmail()

    // Enviar emails
    for (let i = 0; i < betaTesters.length; i++) {
      const email = betaTesters[i]
      
      try {
        this.info(`📤 [${i + 1}/${betaTesters.length}] Enviando para: ${email}`)
        
        // Extrair nome do email
        const userName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
        const htmlContent = betaTestInviteTemplate(userName, logoBase64)
        
        // Usar promise para aguardar o envio
        await new Promise((resolve, reject) => {
          emailService.emailService({
            email: email,
            subject: '🎉 Acesso Exclusivo: Teste a Nova App Encontrar Antes do Lançamento',
            html: htmlContent
          }, (err, info) => {
            if (err) {
              reject(err)
            } else {
              resolve(info)
            }
          })
        })
        
        this.success(`   ✅ Enviado com sucesso!`)
        successCount++
        results.push({ email, success: true })
        
        // Delay de 2 segundos entre emails
        if (i < betaTesters.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
        
      } catch (error) {
        this.error(`   ❌ Erro: ${error.message}`)
        failCount++
        results.push({ email, success: false, error: error.message })
      }
    }

    // Resumo
    this.info('\n' + '='.repeat(60))
    this.info('📊 RESUMO DO ENVIO')
    this.info('='.repeat(60))
    this.success(`✅ Enviados com sucesso: ${successCount}`)
    
    if (failCount > 0) {
      this.error(`❌ Falhas: ${failCount}`)
      this.info('\n❌ Emails que falharam:')
      results.filter(r => !r.success).forEach(r => {
        this.error(`   - ${r.email}: ${r.error}`)
      })
    }
    
    this.info('\n✨ Processo concluído!')
  }
}

module.exports = SendBetaInvites
