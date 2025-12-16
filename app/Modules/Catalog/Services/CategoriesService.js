
    'use strict'
    const Database = use("Database");
    const CategoriesRepository = use("App/Modules/Catalog/Repositories/CategoriesRepository");

    class CategoriesService{
        
    constructor(){}

    async findAllCategoriess(filters) {
      const options = {
        ...new CategoriesRepository().setOptions(filters),
        typeOrderBy: "DESC",
      };
  
      let query = new CategoriesRepository()
        .findAll(options.search, options) 
        .where(function () {})//.where('is_deleted', 0)
      return query.paginate(options.page, options.perPage || 10);
    }
    /**
     *
     * @param {*} Payload
     * @returns
     */
    async createdCategoriess(ModelPayload, UserId) {
      return await new CategoriesRepository().create({
        ...ModelPayload,
        user_id: UserId,
      });  
    }
     
   
    /**
     *
     * @param {*} Id
     * @returns
     */
    async findCategoriesById(Id) {
      return await new CategoriesRepository().findById(Id) 
        //.where('is_deleted', 0)
        .first();
    }

    /**
     *
     * @param {*} Payload
     * @param {*} Id
     * @returns
     */
    async updatedCategories(Id, ModelPayload) {
      return await new CategoriesRepository().update(Id, ModelPayload);
    } 
  
    /**
     * @author "caniggiamoreira@gmail.com"
     * @deprecated "Elimina os dados de forma temporariamente."
     * @param {*} Id 
     * @returns 
     */
    async deleteTemporarilyCategories(Id) {
      return await new CategoriesRepository().delete(Id); 
    }

    /**
     * @author "caniggiamoreira@gmail.com"
     * @deprecated "Elimina os dados de definitivamente."
     * @param {*} Id 
     * @returns 
    */
    async deleteDefinitiveCategories(Id) {
      return await new CategoriesRepository().deleteDefinitive(Id); 
    }

    /**
     * @author "caniggiamoreira@gmail.com"
     * @deprecated "Listar Lixeira -  registos eliminados temporariamente."
     * @param {*} Payload 
     * @returns 
     */ 
    async findAllCategoriessTrash(filters) {
        const options = {
        ...new CategoriesRepository().setOptions(filters),
        typeOrderBy: "DESC",
        };
        let query = new CategoriesRepository()
        .findTrash(options.search, options) 
        .where(function () {})//.where('is_deleted', 1)
        return query.paginate(options.page, options.perPage || 10);
    }
    
    }
    module.exports = CategoriesService
    