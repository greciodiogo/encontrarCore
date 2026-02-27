const { Resend } = require('resend')
const Env = use('Env')

class ResendEmailService {
  constructor() {
    const apiKey = Env.get('RESEND_API_KEY')
    
    if (!apiKey) {
      console.warn('⚠️  RESEND_API_KEY não configurada no .env')
    }
    
    this.resend = new Resend(apiKey)
    this.defaultFrom = Env.get('RESEND_FROM_EMAIL', 'Encontrar <noreply@encontrarshopping.com>')
  }

  /**
   * Enviar email usando Resend
   * @param {Object} emailConfig
   * @param {string} emailConfig.to - Email do destinatário
   * @param {string} emailConfig.subject - Assunto do email
   * @param {string} emailConfig.html - Conteúdo HTML
   * @param {string} [emailConfig.from] - Email do remetente (opcional)
   * @param {string} [emailConfig.replyTo] - Email para respostas (opcional)
   * @param {string} [emailConfig.text] - Conteúdo texto plano (opcional)
   * @param {Array} [emailConfig.cc] - Lista de CC (opcional)
   * @param {Array} [emailConfig.bcc] - Lista de BCC (opcional)
   * @param {Array} [emailConfig.attachments] - Anexos (opcional)
   * @param {Object} [emailConfig.tags] - Tags para tracking (opcional)
   */
  async send(emailConfig) {
    try {
      // Validar email
      if (!this.isValidEmail(emailConfig.to)) {
        throw new Error('Email do destinatário é inválido')
      }

      // Preparar dados do email
      const emailData = {
        from: emailConfig.from || this.defaultFrom,
        to: emailConfig.to,
        subject: emailConfig.subject,
        html: emailConfig.html
      }

      // Adicionar reply-to (respostas vão para este email)
      const replyTo = emailConfig.replyTo || Env.get('RESEND_REPLY_TO')
      if (replyTo) {
        emailData.reply_to = replyTo
      }

      // Adicionar campos opcionais
      if (emailConfig.text) {
        emailData.text = emailConfig.text
      }

      if (emailConfig.cc && emailConfig.cc.length > 0) {
        emailData.cc = emailConfig.cc
      }

      if (emailConfig.bcc && emailConfig.bcc.length > 0) {
        emailData.bcc = emailConfig.bcc
      }

      if (emailConfig.attachments && emailConfig.attachments.length > 0) {
        emailData.attachments = emailConfig.attachments
      }

      if (emailConfig.tags) {
        emailData.tags = emailConfig.tags
      }

      // Enviar email
      const result = await this.resend.emails.send(emailData)

      console.log('✅ Email enviado via Resend:', {
        id: result.data?.id,
        to: emailConfig.to,
        subject: emailConfig.subject
      })

      return {
        success: true,
        messageId: result.data?.id,
        data: result.data
      }

    } catch (error) {
      console.error('❌ Erro ao enviar email via Resend:', error.message)
      
      return {
        success: false,
        error: error.message,
        details: error
      }
    }
  }

  /**
   * Enviar email em lote (até 100 por vez)
   * @param {Array} emails - Array de configurações de email
   */
  async sendBatch(emails) {
    try {
      const emailsData = emails.map(email => ({
        from: email.from || this.defaultFrom,
        to: email.to,
        subject: email.subject,
        html: email.html,
        ...(email.text && { text: email.text }),
        ...(email.tags && { tags: email.tags })
      }))

      const result = await this.resend.batch.send(emailsData)

      console.log(`✅ ${emails.length} emails enviados em lote via Resend`)

      return {
        success: true,
        data: result.data
      }

    } catch (error) {
      console.error('❌ Erro ao enviar emails em lote via Resend:', error.message)
      
      return {
        success: false,
        error: error.message,
        details: error
      }
    }
  }

  /**
   * Validar formato de email
   */
  isValidEmail(email) {
    const re = /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+@(?!-)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/
    return re.test(String(email).trim())
  }
}

module.exports = ResendEmailService
