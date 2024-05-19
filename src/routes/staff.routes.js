const controller = require("../controllers/staff.controller");
const { verifyToken } = require("../middlewares");

module.exports = (app) => {
  app.post("/staff", controller.create);
  app.post("/staff/login", controller.login);
  app.put("/staff/:id", verifyToken, controller.update);
  app.put("/staff/update/password/:id", verifyToken, controller.updatePassword);
  app.put("/staff/reset/password", controller.resetPassword);
  app.get("/staff", controller.findAll);
  app.get("/staff/:id", controller.findOne);
  app.delete("/staff/:id", controller.delete);
};
