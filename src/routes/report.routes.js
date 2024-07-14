const controller = require("../controllers/report.controller");

module.exports = (app) => {
  app.get("/report-member", controller.reportMember);
  app.get("/report-book", controller.reportBook);
  app.get("/report-income", controller.reportIncome);
  app.get("/report-chart", controller.reportChart);
};
