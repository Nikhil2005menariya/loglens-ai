const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: { message: "Unauthorized", code: "UNAUTHORIZED" }
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({
      error: { message: "Invalid token", code: "INVALID_TOKEN" }
    });
  }
};
