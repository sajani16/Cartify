const express = require("express");
const {
  register,
  login,
  verifyEmail,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/verifyOtp", verifyEmail);
router.post("/login", login);

module.exports = router;
