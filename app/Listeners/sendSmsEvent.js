"use strict";

const sendSmsEvent = (exports = module.exports = {});
const SendSmsService = use("App/Services/SendSmsService");

sendSmsEvent.sendSms = async (Contact, Description, CountryCode = "+244") => {
    await new SendSmsService().sendSMS(Contact, Description, CountryCode);
};
