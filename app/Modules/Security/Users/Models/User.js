'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const config = use('Config')
class User extends Model {

    static get connection() {
      //return this.useConnection !== "undefined" ? this.useConnection : config.get('database.connection')
    }

    static setUseConnection(access) {
      return access
    }

  // Disable automatic timestamps since the table uses 'registered' instead
  static get createdAtColumn() {
    return null
  }

  static get updatedAtColumn() {
    return null
  }

  static get traits() {
    return [
      "@provider:Adonis/Acl/HasRole",
      "@provider:Adonis/Acl/HasPermission",
    ];
  }

  static boot() {
    super.boot();
    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook("beforeSave", async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
    this.addTrait("@provider:Auditable");
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany("App/Modules/Security/Auth/Models/Token");
  }
  // perfil() {
  //   return this.belongsToMany(
  //     "App/Modules/Security/Acl/Models/Role"
  //   ).pivotModel("App/Modules/Security/Acl/Models/RoleUser");
  // }
  // empresa() {
  //   return this.belongsTo("App/Modules/Utilitarios/Models/EmpresaConfig");
  // }

  // loja() {
  //   return this.belongsTo("App/Modules/Operacoes/Lojas/Models/Loja");
  // }

  // direccao() {
  //   return this.belongsTo("App/Modules/CRM/Models/Direccao").select("id", "designacao");
  // }
}

module.exports = User
