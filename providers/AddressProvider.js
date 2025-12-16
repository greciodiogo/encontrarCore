const { ServiceProvider } = require("@adonisjs/fold");

class AddressProvider extends ServiceProvider {
  register () {
    this.app.singleton("Adonis/Traits/Addresstable", () => {
      // const Config = this.app.use('Adonis/Src/Config')
      const Addresstable = use("App/Models/Traits/Addresstable");
      return new Addresstable();
    });
    this.app.alias("Adonis/Traits/Addresstable", "Addresstable");
  }

  boot () {
    const Context = this.app.use("Adonis/Src/HttpContext");
    const Addresstable = this.app.use("Addresstable");

    // add ctx to datagrid
    Context.onReady(ctx => {
      Addresstable.ctx = ctx;
    });
  }
}

module.exports = AddressProvider;
