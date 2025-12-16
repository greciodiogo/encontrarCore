'use strict'

class Created {
   get rules() {
    return {
      codigo_iso: `required|max:5|unique:moedas`,
      nome:`required|min:3|max:80|unique:moedas`,
      unidade_fracionaria: `required|max:80`,
      activo: `required`
    };
  }
  get messages() {
    return {
      "required": "É obrigatório informar o", 
      "nome.min": "É obrigatório informar no minimo 3 caráter no campo ",
      "nome.max": "É obrigatório informar no maxímo 80 caráter no campo ",
      "codigo_iso.max": "É obrigatório informar no maxímo 5 caráter no campo ", 

      "exists": "É obrigatório informar um registo valido no campo ",
      "unique": "É obrigatório informar um registo de caracter único no campo ",
      "integer": "É obrigatório informar um número no campo ",
    };
  }

  async fails(errorMessages) { 
   return this.ctx.response.status(400).send(errorMessages[0].message+" "+errorMessages[0].field.replace("_id","").replace("_"," "));
  }
}

module.exports = Created
