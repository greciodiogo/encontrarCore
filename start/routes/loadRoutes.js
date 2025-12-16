const files = require("./contextFiles");
const path = require("path");
const Helpers = use("Helpers");
const pathModule = path.resolve(
  path.resolve(Helpers._appRoot, "app"),
  "Modules"
);

function loadRoutes(ApiRoute, Route) {
  const req = files("./v1", true, /\.js$/);
  var reqModule = files(".", true, /\.js$/, pathModule);
  reqModule = reqModule
    .keys()
    .filter((filename) => filename.search(".routes.js") > 1); 

  req.keys().forEach(async (filename) => {
    const m = await require(filename);
    return m(ApiRoute, Route);
  });
  reqModule.forEach(async (filename) => {
    const m = await require(filename);
    return m(ApiRoute, Route);
  });
}

module.exports = function (Route) {
  /**
   * Lets share same configs across
   * route groups but define middlewares
   * independently
   */
  const ApiRoute = (registerCallback, prefix = "") => {
    return Route.group(registerCallback).prefix(`api/${prefix}`);
  };

  loadRoutes(ApiRoute, Route);
};
