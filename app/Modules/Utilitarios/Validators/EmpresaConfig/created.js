'use strict'

class Created {
   get rules() {
    return {
      taxRegistrationNumber: `required|unique:empresa_configs`,  
    };
  }
  get messages() {
    return {
      "taxRegistrationNumber.required": "É obrigatório informar o nif", 
      "taxRegistrationNumber.min": "É obrigatório informar no minimo 3 caráter no campo ",
      "taxRegistrationNumber.max": "É obrigatório informar no maxímo 80 caráter no campo ",
       
      "exists": "É obrigatório informar um registo valido no campo ",
      "unique": "É obrigatório informar um registo de caracter único no campo ",
      "integer": "É obrigatório informar um número no campo ",
    };
  }

  async fails(errorMessages) { 
   return this.ctx.response.status(400).send(errorMessages[0].message+" "+errorMessages[0].field.replace("_id"," ").replace("_"," "));
  }
}

module.exports = Created
