const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }
    let splitToken = token.split(" ");
    if (splitToken[0] != "Bearer") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (splitToken[1] == "") {
      return res.status(401).json({ message: "Invalid token" });
    }
    const payload = jwt.verify(splitToken[1], process.env.SECRET_KEY);
    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.payload = payload;
    next();
  } catch (error) {
    req.payload = null;
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { verifyToken };
