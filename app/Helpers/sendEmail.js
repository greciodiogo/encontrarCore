const nodemailer = require('nodemailer')
const Env = use("Env");
const NotFoundException = use("App/Exceptions/NotFoundException");

class EnvioEmail {
  async emailService(emailConfig, cb) {

    const smtpPort = parseInt(Env.get('SMTP_PORT', Env.get('MAIL_PORT', 587)));
    const smtpHost = Env.get('SMTP_HOST', Env.get('MAIL_HOST', 'smtp.gmail.com'));
    const emailUser = Env.get('EMAIL_USER', Env.get('EMAIL_FROM'));
    const emailPass = Env.get('EMAIL_PASS', Env.get('MAIL_PASSWORD'));
    const smtpSecure = Env.get('SMTP_SECURE', false) === 'true' || Env.get('SMTP_SECURE', false) === true;

    if (!emailUser || !emailPass) {
      const error = new Error('Email credentials not configured. Check EMAIL_USER and EMAIL_PASS in .env');
      console.error('❌ Email Error:', error.message);
      if (cb) cb(error, null);
      return;
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

    if(!this.isValidEmail(emailConfig.email)){      
      if(cb) cb({
        code: "ERRO_EMAIL_INVALIDO",
        message:"Email do destinario é invalido."
      },null)
      return;
    }
    return await this.sendMail(transporter, emailConfig, cb);
  }

  async sendMail(transporter, emailConfig, cb) {
    const fromEmail = Env.get('EMAIL_USER', Env.get('EMAIL_FROM'));
    
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
        console.error('❌ Email sending failed:', err);
      } else {
        console.log('✅ Email sent successfully:', info);
      }
      if(cb) cb(err, info);
    })

  }
 isValidEmail(email) {
  const re = /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+@(?!-)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  return re.test(String(email).trim());
}
}



module.exports = EnvioEmail