const controller = require("../controllers/otp.controller");

module.exports = (app) => {
  app.post("/otp", controller.create);
  app.post("/otp/confirm", controller.confirm);
};
