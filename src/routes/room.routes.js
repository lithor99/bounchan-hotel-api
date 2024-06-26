const controller = require("../controllers/room.controller");

module.exports = (app) => {
  app.post("/room", controller.create);
  app.put("/room/:id", controller.update);
  app.get("/room", controller.findAll);
  app.get("/room/room-type/:id", controller.findByRoomType);
  app.get("/room/member", controller.findRoomMember);
  app.get("/room/:id", controller.findOne);
  app.get("/room/check-room-no/:roomNo", controller.checkRoomNo);
  app.delete("/room/:id", controller.delete);
  app.delete("/room/image/:id", controller.deleteRoomImage);
};
