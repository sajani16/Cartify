const crypto = require("crypto");

const generateOTP = () => {
  const otp = Math.floor(10000 + Math.random() * 900000).toString();

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  return {
    otp,
    hashedOTP,
  };
};

module.exports = generateOTP;
