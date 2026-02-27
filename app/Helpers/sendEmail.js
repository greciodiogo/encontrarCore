const nodemailer = require('nodemailer')
const Env = use("Env");
const { getEmailConfig, detectEmailType } = require('../Config/emailTypes');

/**
 * Classe unificada de envio de emails
 * Suporta Resend (recomendado) ou Gmail/SMTP (fallback)
 * Configuração via .env: EMAIL_PROVIDER=resend ou EMAIL_PROVIDER=nodemailer
 * Emails dedicados por função (automático)
 */
class EnvioEmail {
  constructor() {
    this.provider = Env.get('EMAIL_PROVIDER', 'nodemailer').toLowerCase();
    
    // Inicializar Resend se configurado
    if (this.provider === 'resend') {
      try {
        const { Resend } = require('resend');
        const apiKey = Env.get('RESEND_API_KEY');
        
        if (!apiKey) {
          console.warn('⚠️  RESEND_API_KEY não configurada, usando Gmail como fallback');
          this.provider = 'nodemailer';
        } else {
          this.resend = new Resend(apiKey);
          console.log('✅ Email provider: Resend (com emails dedicados)');
        }
      } catch (error) {
        console.warn('⚠️  Resend não disponível, usando Gmail como fallback:', error.message);
        this.provider = 'nodemailer';
      }
    }
    
    if (this.provider === 'nodemailer') {
      console.log('✅ Email provider: Gmail/SMTP');
    }
  }

  /**
   * Método principal - mantém interface original
   * @param {Object} emailConfig - Configuração do email
   * @param {string} emailConfig.email - Email do destinatário
   * @param {string} emailConfig.subject - Assunto
   * @param {string} emailConfig.text - Texto plano
   * @param {string} emailConfig.html - HTML (opcional)
   * @param {Array} emailConfig.ccEmail - Lista CC (opcional)
   * @param {Array} emailConfig.attachment - Anexos (opcional)
   * @param {string} emailConfig.type - Tipo do email (opcional: transactional, orders, support, marketing, sellers, notifications)
   * @param {string} emailConfig.context - Contexto para detecção automática (opcional)
   * @param {Function} cb - Callback (opcional)
   */
  async emailService(emailConfig, cb) {
    // Validar email
    if (!this.isValidEmail(emailConfig.email)) {
      const error = {
        code: "ERRO_EMAIL_INVALIDO",
        message: "Email do destinatário é inválido."
      };
      console.error('❌ Email Error:', error.message);
      if (cb) cb(error, null);
      return Promise.reject(error);
    }

    // Detectar ou usar tipo de email especificado
    const emailType = emailConfig.type || detectEmailType(emailConfig);
    const typeConfig = getEmailConfig(emailType);
    
    // Adicionar configuração do tipo ao emailConfig
    emailConfig._typeConfig = typeConfig;
    emailConfig._detectedType = emailType;

    // Usar Resend ou Gmail baseado na configuração
    if (this.provider === 'resend') {
      return await this.sendViaResend(emailConfig, cb);
    } else {
      return await this.sendViaGmail(emailConfig, cb);
    }
  }

  /**
   * Enviar via Resend (novo) - com emails dedicados
   */
  async sendViaResend(emailConfig, cb) {
    try {
      const typeConfig = emailConfig._typeConfig;
      const emailType = emailConfig._detectedType;
      
      const emailData = {
        from: typeConfig.from,
        to: emailConfig.email,
        subject: emailConfig.subject,
        html: emailConfig.html || emailConfig.text,
        reply_to: typeConfig.replyTo
      };

      // Adicionar texto plano se disponível
      if (emailConfig.text && emailConfig.html) {
        emailData.text = emailConfig.text;
      }

      // Adicionar CC se disponível
      if (emailConfig.ccEmail && emailConfig.ccEmail.length > 0) {
        emailData.cc = emailConfig.ccEmail;
      }

      // Adicionar anexos se disponível
      if (emailConfig.attachment && emailConfig.attachment.length > 0) {
        emailData.attachments = emailConfig.attachment;
      }

      // Adicionar tags para tracking
      emailData.tags = {
        category: emailType,
        source: 'encontrar-backend'
      };

      // Enviar via Resend
      const result = await this.resend.emails.send(emailData);

      const info = {
        messageId: result.data?.id,
        accepted: [emailConfig.email],
        response: 'Email sent via Resend',
        provider: 'resend',
        emailType: emailType,
        from: typeConfig.from
      };

      console.log(`✅ Email sent via Resend [${emailType}]:`, {
        id: result.data?.id,
        from: typeConfig.from,
        to: emailConfig.email,
        subject: emailConfig.subject
      });

      if (cb) cb(null, info);
      return info;

    } catch (error) {
      console.error('❌ Resend error:', error.message);
      console.warn('⚠️  Tentando fallback para Gmail...');
      
      // Fallback automático para Gmail
      return await this.sendViaGmail(emailConfig, cb);
    }
  }

  /**
   * Enviar via Gmail/SMTP (original)
   */
  async sendViaGmail(emailConfig, cb) {
    const smtpPort = parseInt(Env.get('SMTP_PORT', Env.get('MAIL_PORT', 587)));
    const smtpHost = Env.get('SMTP_HOST', Env.get('MAIL_HOST', 'smtp.gmail.com'));
    const emailUser = Env.get('EMAIL_USER', Env.get('EMAIL_FROM'));
    const emailPass = Env.get('EMAIL_PASS', Env.get('MAIL_PASSWORD'));
    const smtpSecure = Env.get('SMTP_SECURE', false) === 'true' || Env.get('SMTP_SECURE', false) === true;

    if (!emailUser || !emailPass) {
      const error = new Error('Email credentials not configured. Check EMAIL_USER and EMAIL_PASS in .env');
      console.error('❌ Email Error:', error.message);
      if (cb) cb(error, null);
      return Promise.reject(error);
    }

    let transporter = nodemailer.createTransport({
      port: smtpPort,
      host: smtpHost,
      secure: smtpSecure,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    return await this.sendMail(transporter, emailConfig, cb);
  }

  /**
   * Enviar via nodemailer (Gmail/SMTP)
   */
  async sendMail(transporter, emailConfig, cb) {
    const fromEmail = Env.get('EMAIL_USER', Env.get('EMAIL_FROM'));
    
    return new Promise((resolve, reject) => {
      transporter.sendMail({
        from: `Encontrar <${fromEmail}>`,
        to: emailConfig.email,
        subject: emailConfig?.subject,
        text: emailConfig.text ? emailConfig.text : '',
        html: emailConfig.html ? emailConfig.html : '',
        cc: emailConfig.ccEmail ? emailConfig.ccEmail : [],
        attachments: emailConfig.attachment ? emailConfig.attachment : []
      }, function (err, info) {
        if (err) {
          console.error('❌ Email sending failed via Gmail:', err);
          if (cb) cb(err, null);
          reject(err);
        } else {
          console.log('✅ Email sent via Gmail:', info);
          if (cb) cb(null, info);
          resolve(info);
        }
      });
    });
  }

  /**
   * Validar formato de email
   */
  isValidEmail(email) {
    const re = /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+@(?!-)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    return re.test(String(email).trim());
  }
}

module.exports = EnvioEmail
