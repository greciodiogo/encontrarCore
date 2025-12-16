const Env = use("Env");
const APP_SECRET = Env.get("APP_KEY");
const jwt = require('jsonwebtoken');

module.exports = {

  options: { expiresIn: '60s' },
  generateToken(value){
    var token = jwt.sign({ data: value}, APP_SECRET, this.options);
    return token;
  },

  verify(token){
    try {
       jwt.verify(token, APP_SECRET);
       return true;
    } catch (error) {
      return false
    }
  }
 };
