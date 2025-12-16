const nodemailer = require('nodemailer')
const Env = use("Env");
const NotFoundException = use("App/Exceptions/NotFoundException");

class EnvioEmail {
  async emailService(emailConfig, cb) {

    let transporter = nodemailer.createTransport({
      port: Env.get('SMTP_PORT'),
      host: Env.get('SMTP_HOST'),
      //secure: true, // true for 465, false for other ports 587
      auth: {
        user: Env.get('EMAIL_FROM'),
        pass: "$nig_port#24"
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
    
    transporter.sendMail({
      from: `Angola Telecom <${Env.get('EMAIL_FROM')}> `,
      to: emailConfig.email,
      subject: emailConfig?.subject,
      text: emailConfig.text ? emailConfig.text : '',
      html: emailConfig.html ? emailConfig.html : '',
      cc: emailConfig.ccEmail ? emailConfig.ccEmail : [],
      attachments: emailConfig.attachment ? emailConfig.attachment : []

    }, function (err, info) {
      console.log(err, info);
      if(cb) cb(err, info);
    })

  }
 isValidEmail(email) {
  const re = /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+@(?!-)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  return re.test(String(email).trim());
}
}



module.exports = EnvioEmail