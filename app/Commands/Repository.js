'use strict'

const { Command } = require('@adonisjs/ace')
const Helpers = use("Helpers");
const path2 = require('path');
class Repository extends Command {
 
  static get signature () {  
    return `make:repository
        { name: Name of the user to repository}
        { --m=@value : Define a custom module to be used  }
      `}

  static get description () {
    return 'create  app\\Repositories';
  }
  async handle (args, flags) {  
    const barra_so = path2.sep;
    const repository = args.name; 
    const module = flags.m || "";
    const path = `app${barra_so}Modules${barra_so}${module}${barra_so}Repositories${barra_so}${repository}Repository.js`;
    const exists = await this.pathExists(path); 
    if (exists) {
      this.error(`${Helpers.appRoot()}${barra_so}${path} already exists`)
    }else{
      this.generateFile(path,this.content(repository, module));
      this.success(`${this.iconsMain.success} create ${path}`) 
    }
    
  }

  content(repository,module) {
    return`
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class ${repository}Repository extends BaseStorageRepository{
        ${this.methods(repository, module)}
    }    
    module.exports = ${repository}Repository
    `
  }  
  methods(repository, module){
    return `
    constructor() {
      super("${repository}", "App/Modules/${module}/Models/")
    } 
    `
  }
}

module.exports = Repository
