const crypto = require("crypto");
module.exports = (string) => {
  if (string) {
    var key =
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4faWshk9wvZUouz4A3K4Zzb2N\n" +
      "Otbp262HcB1mJYF1QDs3wAndkGiqPcBx7TGeIEjuBtg6DFtSy29w1dRCANdqIDqa\n" +
      "CqX+/PNE8dz8foCauiy5OEU2segqAeN3X8PXBevqGThd/x9OPJ4pV2Kgx/oAs7Bw\n" +
      "g3/C2AM3qraj0UulhwIDAQAB\n" +
      "-----END PUBLIC KEY-----";

    var signature  = crypto.publicDecrypt(key,
                 Buffer.from(string, 'base64'));
                 
    return signature.toString();
    // return signature;
    
  }
};
