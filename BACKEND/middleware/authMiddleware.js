const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token not authorized" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

module.exports = protect;
