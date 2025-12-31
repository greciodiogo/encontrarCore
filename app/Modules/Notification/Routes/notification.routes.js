
    module.exports = (ApiRoute, Route) =>
    // Protected routes
    ApiRoute(() => {
      Route.get("/", "NotificationController.index");
      Route.post("/", "NotificationController.store");
      Route.get("/:id", "NotificationController.show");
      Route.put("/:id", "NotificationController.update");
      Route.delete("/:id", "NotificationController.destroy");
      
      // Firebase Push Notifications Routes
      Route.post("/device-token/register", "DeviceTokenController.register");
      Route.post("/device-token/unregister", "DeviceTokenController.unregister");
      Route.get("/device-token/list", "DeviceTokenController.list");
      Route.get("/device-token/:id", "DeviceTokenController.show");
      Route.delete("/device-token/delete-all", "DeviceTokenController.deleteAll");
    }, 'notifications').namespace("App/Modules/Notification/Controllers").middleware(["auth"]);
