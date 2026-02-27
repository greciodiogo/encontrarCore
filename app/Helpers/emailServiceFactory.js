const Env = use('Env')

/**
 * Factory para escolher o serviço de email baseado na configuração
 */
class EmailServiceFactory {
  static create() {
    const provider = Env.get('EMAIL_PROVIDER', 'nodemailer') // 'nodemailer' ou 'resend'
    
    if (provider === 'resend') {
      const ResendEmailService = require('./sendEmailResend')
      return new ResendEmailService()
    } else {
      const EnvioEmail = require('./sendEmail')
      return new EnvioEmail()
    }
  }

  /**
   * Wrapper unificado para enviar email independente do provider
   */
  static async send({ to, subject, html, text, cc, bcc, attachments, tags }) {
    const provider = Env.get('EMAIL_PROVIDER', 'nodemailer')
    
    if (provider === 'resend') {
      const ResendEmailService = require('./sendEmailResend')
      const service = new ResendEmailService()
      
      return await service.send({
        to,
        subject,
        html,
        text,
        cc,
        bcc,
        attachments,
        tags
      })
    } else {
      // Usar nodemailer (antigo)
      const EnvioEmail = require('./sendEmail')
      const service = new EnvioEmail()
      
      return new Promise((resolve, reject) => {
        service.emailService({
          email: to,
          subject,
          html,
          text,
          ccEmail: cc,
          attachment: attachments
        }, (err, info) => {
          if (err) {
            reject(err)
          } else {
            resolve({ success: true, info })
          }
        })
      })
    }
  }
}

module.exports = EmailServiceFactory
