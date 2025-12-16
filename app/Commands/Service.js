'use strict'

const { Command } = require('@adonisjs/ace')
const Helpers = use("Helpers");
const path2 = require('path');
const barra_so = path2.sep;

class Service extends Command {

  static get signature () {
    return `make:service
        { name: Name of the user to service}
        { --m=@value : Define a custom module to be used  }
      `}
 
  static get description () {
    return `create  app${barra_so}Services`;
  }
  async handle (args, flags) { 
    
    const service = args.name;
    const module = flags.m  || "";
    const path = `app${barra_so}Modules${barra_so}${module}${barra_so}Services${barra_so}${service}Service.js`;
    const exists = await this.pathExists(path); 
    if (exists) {
      this.error(`${Helpers.appRoot()}${barra_so}${path} already exists`)
    }else{
      this.generateFile(path,this.content(service,module));
      this.success(`${this.iconsMain.success} create ${path}`)
    }
    
  }

  content(service, module) {
    return`
    'use strict'
    const Database = use("Database");
    const ${service}Repository = use("App/Modules/${module}/Repositories/${service}Repository");

    class ${service}Service{
        ${this.methods(service)}
    }
    module.exports = ${service}Service
    `
  }

  methods(service){
    return `
    constructor(){}

    async findAll${service}s(filters) {
      const options = {
        ...new ${service}Repository().setOptions(filters),
        typeOrderBy: "DESC",
      };
  
      let query = new ${service}Repository()
        .findAll(options.search, options) 
        .where(function () {}).where('is_deleted', 0)
      return query.paginate(options.page, options.perPage || 10);
    }
    /**
     *
     * @param {*} Payload
     * @returns
     */
    async created${service}s(ModelPayload, UserId) {
      return await new ${service}Repository().create({
        ...ModelPayload,
        user_id: UserId,
      });  
    }
     
   
    /**
     *
     * @param {*} Id
     * @returns
     */
    async find${service}ById(Id) {
      return await new ${service}Repository().findById(Id) 
        .where('is_deleted', 0)
        .first();
    }

    /**
     *
     * @param {*} Payload
     * @param {*} Id
     * @returns
     */
    async updated${service}(Id, ModelPayload) {
      return await new ${service}Repository().update(Id, ModelPayload);
    } 
  
    /**
     * @author "caniggiamoreira@gmail.com"
     * @deprecated "Elimina os dados de forma temporariamente."
     * @param {*} Id 
     * @returns 
     */
    async deleteTemporarily${service}(Id) {
      return await new ${service}Repository().delete(Id); 
    }

    /**
     * @author "caniggiamoreira@gmail.com"
     * @deprecated "Elimina os dados de definitivamente."
     * @param {*} Id 
     * @returns 
    */
    async deleteDefinitive${service}(Id) {
      return await new ${service}Repository().deleteDefinitive(Id); 
    }

    /**
     * @author "caniggiamoreira@gmail.com"
     * @deprecated "Listar Lixeira -  registos eliminados temporariamente."
     * @param {*} Payload 
     * @returns 
     */ 
    async findAll${service}sTrash(filters) {
        const options = {
        ...new ${service}Repository().setOptions(filters),
        typeOrderBy: "DESC",
        };
        let query = new ${service}Repository()
        .findTrash(options.search, options) 
        .where(function () {}).where('is_deleted', 1)
        return query.paginate(options.page, options.perPage || 10);
    }
    `
  }
}


module.exports = Service
