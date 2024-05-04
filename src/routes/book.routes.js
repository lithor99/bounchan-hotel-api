const controller = require("../controllers/book.controller");
const { verifyToken } = require("../middlewares");

module.exports = (app) => {
  app.post("/book", verifyToken, controller.create);
  app.put("/book/:id", verifyToken, controller.updateBook);
  app.put("/book/detail/:id", verifyToken, controller.updateBookDetail);
  app.put("/book/check-in/:bookId", verifyToken, controller.checkIn);
  app.put("/book/check-out/:bookId", verifyToken, controller.checkOut);
  app.get("/book", controller.findAll);
  app.get("/book/member/:id", controller.findByMember);
  app.get("/book/:id", controller.findOne);
  app.delete("/book/:id", controller.delete);
};
