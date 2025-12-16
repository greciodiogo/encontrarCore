'use strict'

const { Command } = require('@adonisjs/ace')
const Helpers = use("Helpers");
const path2 = require('path');
class Validator extends Command {

  static get signature () {
    return `make:validator
        { name: Name of the user to validator}
        { --m=@value : Define a custom module to be used  }
      `} 

  static get description () {
    return 'create  app${barra_so}Validators';
  }
  async handle (args, flags) {
    const barra_so = path2.sep;
    const validator = args.name; 
    const module = flags.m || "";
    const path = `app${barra_so}Modules${barra_so}${module}${barra_so}Validators${barra_so}${validator}Validator.js`;
    const exists = await this.pathExists(path);
    if (exists) {
      this.error(`${Helpers.appRoot()}${barra_so}${path} already exists`)
    }else{
      this.generateFile(path,this.content(validator));
      this.success(`${this.iconsMain.success} create ${path}`)
    }
  }

  content(validator) {
    return`
    'use strict'
    const NotCreatedException = use("App/Exceptions/NotCreatedException");
    const NotBadGatewayException = use("App/Exceptions/NotBadGatewayException");
    const NotFoundException = use("App/Exceptions/NotFoundException");

    class ${validator}Validator{
        ${this.methods(validator)}
    }
    module.exports = ${validator}Validator
    `
  }
 
  methods(validator){
    return `
    get rules () {
        return {
        }
     }

    get messages () {
        return {
        }
      }

     async fails(error) {
      const errorMessages = error[0].message;
      if(error[0].validation=='ENGINE_EXCEPTION') throw new NotBadGatewayException();
      if(error[0].validation=='externalExists' || error[0].validation=='exists') throw new NotFoundException(errorMessages);
      throw new NotCreatedException(errorMessages);
    }
    `
  }
}
module.exports = Validator

