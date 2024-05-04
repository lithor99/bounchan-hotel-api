const controller = require("../controllers/room.image.controller");

module.exports = (app) => {
  app.post("/room-image", controller.create);
  app.put("/room-image/:id", controller.update);
  app.get("/room-image", controller.findAll);
  app.get("/room-image/:id", controller.findOne);
  app.delete("/room-image/:id", controller.delete);
};
