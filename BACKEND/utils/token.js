const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (userId, name, email,role) => {
  return jwt.sign({ id: userId, name, email,role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d",
  });
};

module.exports = generateToken;
