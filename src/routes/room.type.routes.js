const controller = require("../controllers/room.type.controller");

module.exports = (app) => {
  app.post("/room-type", controller.create);
  app.put("/room-type/:id", controller.update);
  app.get("/room-type", controller.findAll);
  app.get("/room-type/:id", controller.findOne);
  app.delete("/room-type/:id", controller.delete);
};
