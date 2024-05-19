const controller = require("../controllers/member.controller");
const { verifyToken } = require("../middlewares");

module.exports = (app) => {
  app.post("/member", controller.create);
  app.post("/member/login", controller.login);
  app.put("/member/:id", verifyToken, controller.update);
  app.put(
    "/member/update/password/:id",
    verifyToken,
    controller.updatePassword
  );
  app.put("/member/reset/password", controller.resetPassword);
  app.get("/member", controller.findAll);
  app.get("/member/:id", controller.findOne);
  app.get("/member/check/email/:email", controller.checkEmail);
  app.delete("/member/:id", controller.delete);
};
