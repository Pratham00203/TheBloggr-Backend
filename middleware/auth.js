const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader;

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
    if (err) {
      res.status(401).json({ msg: "Token not valid" });
    }
    req.user = user;
    next();
  });
};
