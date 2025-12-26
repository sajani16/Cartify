const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  imageId: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailOTP: String,
  emailOTPExpire: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const user = mongoose.model("User", userSchema);

module.exports = user;
