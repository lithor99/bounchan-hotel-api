const controller = require("../controllers/send.mail.controller");

module.exports = (app) => {
  app.post("/send-mail", controller.sendEmail);
};
