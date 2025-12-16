"use strict";

const EmailEvent = (exports = module.exports = {});
const emailService = use("App/Helpers/sendEmail");
const EnvioEmail=  new emailService()

EmailEvent.sendEmail = async (
  emailConfig = {
    subject: null,
    email: null,
    ccEmail: [],
    attachment: [],
    text:null,
  }
) => {
   EnvioEmail.emailService(emailConfig);
};
