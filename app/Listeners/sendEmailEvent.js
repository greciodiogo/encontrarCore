"use strict";

const sendEmailEvent = (exports = module.exports = {});
const SendEMailService = use("App/Services/SendEMailService");
const Database = use('Database')

sendEmailEvent.sendEmail = async (To, Subject, Text, Options = { cc: [], attachments: [] }) => {
  await new SendEMailService().sendEMail(To, Subject, Text, Options);
};


sendEmailEvent.sendEmailPedido = async (pedido) => {

  const userSendEmailTo = Database.select('email').from('users').where('id', pedido.user_id).first();
  var userCcEmails = Database.select('users.email').from('pedido_config_sendmail_users')
    .innerJoin("users", "users.id", "pedido_config_sendmail_users.user_id_sendemail").where('is_actived', true)
    .where('direccao_actual_id', pedido.direccao_actual_id).where('pedido_tipo_id', pedido.pedido_tipo_id)

  var CcEmails = [];

  if(userCcEmails.length==0){
    userCcEmails = Database.select('email').from('users').where('direccao_id', pedido.direccao_actual_id).where('is_actived', true);
  }

  userCcEmails.forEach(element => {
    if(element.email!=null){
      CcEmails.push(element.email)
    }
  });

  const emailConfig = {
    Subject: `Pedido | ${pedido.tipo}`,
    To: userSendEmailTo.email,
    Text: `Pedido | ${pedido.tipo}, nº ${pedido.id}, estado ${pedido.estado}`,
    Options: {
        cc: userCcEmails,
        attachments: []
      }
  }
  await new SendEMailService().sendEMail(emailConfig.To, emailConfig.Subject, emailConfig.Text, emailConfig.Options);
}
