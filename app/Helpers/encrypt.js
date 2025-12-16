const crypto = require("crypto");
module.exports = (string) => {
  try{
  if (string) {
    var key =
      "-----BEGIN RSA PRIVATE KEY-----\n" +
      "MIICXQIBAAKBgQC4faWshk9wvZUouz4A3K4Zzb2NOtbp262HcB1mJYF1QDs3wAnd\n" +
      "kGiqPcBx7TGeIEjuBtg6DFtSy29w1dRCANdqIDqaCqX+/PNE8dz8foCauiy5OEU2\n" +
      "segqAeN3X8PXBevqGThd/x9OPJ4pV2Kgx/oAs7Bwg3/C2AM3qraj0UulhwIDAQAB\n" +
      "AoGAW0RlQk0LXaWb9ZNzn++L/V3niMdz7Crt1JOlJ5QkUAHfibvp5X78GEQGQRXr\n" +
      "NuOX0JD4RPc58mKLldFieOh7p8B/dx8UZyWd11TUOnVwOSJaFd3rwnHzobEUJgH2\n" +
      "24b1bGOWsk+0XEisS1B7xl4d8T74+Dpnpugg4nU/1rAKgjECQQDfpe5Nihi9Fgfz\n" +
      "rcr8s9oGGdKV7nyVXUmBN5Dm5PMfAev49Wo6ZvhO9EW1mb15Kuqfc56Sq5ErDdRg\n" +
      "MPnODP8JAkEA0y2nOcjWn3ZsX0lPvGpKotnFUgO4WlpJfd6fzxTfQrLqHf6ixFPt\n" +
      "wTApqhU0fx9xMWl6m1Kh0WiegMYk8LwUDwJATafsCvh8hotzz2T1KrG4bo3g1Tau\n" +
      "A58Uus10fvfYg1fDe/qbHBRM+/1NhzUO2VfRh/Q5h2wTSAPRTmUzGBzjIQJBAIQw\n" +
      "z70cOz0WpEABZChNYOsP5rSwH3ZvjhF8igzWw+q8lFCyVLEQ2INV4r7VB0eMJw8H\n" +
      "N/iCgUjUdGOnpPgMw4ECQQCboFsTKkzrLOkZJiipgid08xPiBJCfd5Pjl7ggnwoj\n" +
      "CL9JXAsSBvOTvTuo2XnBHOpaWO8oOEUt5xBbUPGLhdaA\n" +
      "-----END RSA PRIVATE KEY-----";

    var signature = crypto.privateEncrypt(key, Buffer.from(string, 'utf8')).toString('base64');
    // var signature = crypto.privateEncrypt(key, Buffer.from(string, 'utf8'));

    return signature;
  }
}catch(error){
  console.log("error encrypt:"+error)
}
};
