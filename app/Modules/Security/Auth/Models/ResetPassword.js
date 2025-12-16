'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const jwt = use("App/Helpers/JsonWebToken");

class ResetPassword extends Model {
    static boot() {
        super.boot()
        this.addTrait('@provider:Auditable')
        /**
         * A hook to hash the user password before saving
         * it to the database.
         */
        this.addHook("beforeSave", async (userInstance) => {
          if (userInstance.dirty.email) {
            userInstance.token = jwt.generateToken(userInstance.email);
         /* userInstance.expiresIn = jwt.options.expiresIn;
            userInstance.code = await Hash.make(userInstance.code); */
          }
        });
      }
    
}

module.exports = ResetPassword
