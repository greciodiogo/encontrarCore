"use strict";
const AxiosConnected = use("App/Services/AxiosConnected");
const smpp = require('smpp');
const Env = use("Env");
const URL = Env.get("SMS_SERVICE_URL");
const httpMethod = Env.get("SMS_SERVICE_METHOD") || "get";
const axiosPayloadChannel = Env.get("SMS_SERVICE_BODY");
const session = null//new smpp.Session({ host: Env.get("SMS_HOST"), port: Env.get("SMS_PORT") });


const credentials = {
  user: Env.get("SMS_SERVICE_USER"),
  from: Env.get("SMS_SERVICE_FROM"),
  password: Env.get("SMS_SERVICE_PASSWORD"),
  [Env.get("SMS_SERVICE_API_KEY")]: Env.get("SMS_SERVICE_API_VALUE"),
};


class SendSmsService {
  constructor() { }

  /**
   * @description
   * @param {*} phone
   * @param {*} description
   * @returns
   */
  //FC: Anterior
  async sendSMS(Contact, Description, CountryCode = "+244") {
    const to = `${CountryCode}${Contact}`;
    const text = Description;
    return await new AxiosConnected().channel(
      { credentials, to, text },
      URL,
      axiosPayloadChannel,
      httpMethod
    );
  }
  async sendSMS(Contact, Description, CountryCode = "+244") {
    const to = `${CountryCode}${Contact}`;
    const text = Description;

    session.on('connect', () => {
      session.bind_transceiver({
        system_id: Env.get("SMS_USER"),
        password: Env.get("SMS_PASSWORD")
      }, (pdu) => {
        if (pdu.command_status == 0) {
          //console.log('Success Connection');
          this.sendSMSToSMPP(1, to, text);
        }
      })
    })
  }

  sendSMSToSMPP(from, to, text) {
    //console.log('A enviar sms...');
    from = '';
    session.submit_sm({
      destination_addr: to,
      short_message: text,
      source_addr_ton: 5,
      source_addr_npi: 0, // 0 = Unknown, 1 = ISDN, 3 = Data, 4 = Telex, 5 = SMS, 6 = Radio, 7 = Fax, 8 = Videotelephony
      dest_addr_ton: 1, // Type of number of the destination phone number
      dest_addr_npi: 1, // 0 = Unknown, 1 = ISDN, 3 = Data, 4 = Telex, 5 = SMS, 6 = Radio, 7 = Fax, 8 = Videotelephony
      source_addr: Env.get("SMS_SHORTNAME"),       // The Sender ID or Address, This will be displayed to the destination phone number
      registered_delivery: 1,
    }, function (pdu) {
      if (pdu.command_status == 0) {
        //console.log("SMS ENVIADA:", pdu);
      }
    });
  }
}
module.exports = SendSmsService;
