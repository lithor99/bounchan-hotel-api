const controller = require("../controllers/room.controller");

module.exports = (app) => {
  app.post("/room", controller.create);
  app.put("/room/:id", controller.update);
  app.get("/room", controller.findAll);
  app.get("/room/room-type/:id", controller.findByRoomType);
  app.get("/room/:id", controller.findOne);
  app.delete("/room/:id", controller.delete);
};
