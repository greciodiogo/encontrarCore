"use strict";
const User = use("App/Modules/Security/Users/Models/User");
const Permission = use("App/Modules/Security/Acl/Models/Permission");
const Role = use("App/Modules/Security/Acl/Models/Role");
const EmpresaConfig = use("App/Modules/Utilitarios/Models/EmpresaConfig");

const LoggerRepository = use("App/Repositories/LoggerRepository");
class AuthenticatedRepository {
  constructor() {}
  /**
   *
   * @param {*} payload
   */
  async authenticate(request, auth, response) {
    const { username, password } = request.all();
    try {
      const responseAdapter = await this.findByUserAuth(username);
      const token = await auth
        .withRefreshToken()
        .query((builder) => {
          builder.where("is_deleted", 0).where("is_actived", 1);
        })
        .attempt(username, password);

      await LoggerRepository.register({
        user: responseAdapter.user,
        auditable_id: responseAdapter.user.id,
        auditable: "User",
        event: "LOGIN",
        url: request.originalUrl(),
        ip: request.ip(),
        old_data: null,
        success: true,
        message: `Login successfully, ${responseAdapter.user.name}`,
        new_data: responseAdapter,
      });
      return response.ok(
        { ...responseAdapter, token: token },
        {
          message: `Seja Bem-vindo Sr(a) ${responseAdapter.user.name}`,
        }
      );
    } catch (e) {
      return response.unauthorized(null, {
        title: "Falha na Autenticação",
        message:
          "Nome de utilizador ou Password Inválido, ou consulta o administrador para verificar se a sua conta está activa",
      });
    }
  }

  /**
   *
   * @param {*} username
   * @returns
   */
  async findByUserAuth(username) {
    const user = await User.findBy("username", username);
    const roles = await user.getRoles();
    let permissions = await this.findPermissionByUser(user.id);
    const empresa = await EmpresaConfig.find(user.toJSON().empresa_config_id);
    const responseAdapter = Object.assign(
      {},
      { user: { ...user.toJSON(), empresa: empresa } },
      { role: { name: roles[0] }, permissions: permissions }
    );
    delete responseAdapter.user.password;
    delete responseAdapter.user.is_deleted;
    delete responseAdapter.user.created_at;
    delete responseAdapter.user.updated_at;
    return responseAdapter;
  }
  /**
   *
   * @param {*} user_id
   * @returns
   */
  async findPermissionByUser(user_id) {
    let permissions = [];
    const user = await User.find(user_id);
    const roles = await user.getRoles();

    let permissions_user = await Permission.query()
      .select("slug")
      .innerJoin(
        "permission_user",
        "permission_user.permission_id",
        "permissions.id"
      )
      .where("permission_user.user_id", user_id)
      .fetch();
    permissions_user = permissions_user.toJSON();

    for (let r = 0; r < roles.length; r++) {
      let role = await Role.findBy("slug", roles[r]);
      let permissionSlugs = await role.getPermissions();
      for (let i = 0; i < permissionSlugs.length; i++) {
        permissions.push({ slug: permissionSlugs[i] });
      }
    }
    for (let i = 0; i < permissions_user.length; i++) {
      permissions.push({ slug: permissions_user[i] });
    }
    return permissions;
  }

  /**
   * Revoke refresh access
   * POST /auth/logout
   *
   * @param {Object} ctx - context
   * @param {Auth} ctx.auth - auth
   * @param {Response} ctx.response - response
   * @auth Caniggia Moreira <caniggia.moreira@ideiasdinamicas.com>
   */
  async logout(auth, request) {
    const { refreshToken, _refId } = request.all();

    try {
      const check = await auth.check();
      if (check) {
        await auth.logout();
        /*var moment = require("moment");
        await LogsLogin.query().where('user_id',_refId).where('status', true).whereNull('date_logout').update({ status: false, date_logout:moment(new Date()).format("YYYY-MM-DD H:m:s") })
        const token = await auth.getAuthHeader();
        await auth.authenticator("jwt").revokeTokens([token]);*/
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  async refreshTokenContinue(request, response, auth) {
    const { password, username, refresh_token } = request.all();
    try {
      const responseAdapter = await this.findByUserAuth(username);
      const user = await User.find(responseAdapter.user.id);
      await auth.authenticator("jwt").revokeTokensForUser(user);
      const token = await auth
        .withRefreshToken()
        .query((builder) => {
          builder.where("is_deleted", 0).where("is_actived", 1);
        })
        .attempt(username, password);
      await LoggerRepository.register({
        user: responseAdapter.user,
        auditable_id: responseAdapter.user.id,
        auditable: "User",
        event: "LOGIN",
        url: request.originalUrl(),
        ip: request.ip(),
        old_data: null,
        success: true,
        message: `Login successfully, ${responseAdapter.user.name}`,
        new_data: responseAdapter,
      });
      return response.ok(
        { ...responseAdapter, token: token },
        {
          message: `Seja Bem-vindo Sr(a) ${responseAdapter.user.name}`,
        }
      );
    } catch (e) {
      return response.unauthorized(null, {
        title: "Falha na Autenticação",
        message:
          "Nome de utilizador ou Password Inválido, ou consulta o administrador para verificar se a sua conta está activa "+e,
      });
    }
  }
}

module.exports = AuthenticatedRepository;
