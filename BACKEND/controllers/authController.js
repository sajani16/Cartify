const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/token");
const sendEmail = require("../utils/email");
const generateOTP = require("../utils/otp");
const crypto = require("crypto");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({
        message: "All fields required",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    // If user exists and is verified → cannot register again
    if (existingUser && existingUser.isVerified) {
      return res.json({
        message: "User already exists",
        success: false,
      });
    }

    // If user exists but not verified → resend OTP
    if (existingUser && !existingUser.isVerified) {
      const { otp, hashedOTP } = generateOTP();

      existingUser.emailOTP = hashedOTP;
      existingUser.emailOTPExpire = Date.now() + 10 * 60 * 1000; // 10 mins
      await existingUser.save();

      await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `<p>Your OTP is:</p><h2>${otp}</h2><p>Expires in 10 minutes</p>`,
      });

      return res.json({
        message: "OTP resent to your email",
        success: true,
        email: existingUser.email,
      });
    }

    // New user creation
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const { otp, hashedOTP } = generateOTP();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailOTP: hashedOTP,
      emailOTPExpire: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `<p>Your OTP is:</p><h2>${otp}</h2><p>Expires in 10 minutes</p>`,
    });

    res.json({
      message: "OTP sent to your email",
      success: true,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
}

//otp verification
async function verifyEmail(req, res) {
  const { email, otp } = req.body;
  console.log(req.body);
  if (!otp) {
    return res
      .status(400)
      .json({ message: "Email and OTP required", success: false });
  }
  // Hash incoming OTP user sent
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  // Find user with valid OTP from db as we have stored
  const user = await User.findOne({
    email,
    emailOTP: hashedOTP,
    emailOTPExpire: { $gt: Date.now() }, //gt means greater than as aaila ko date vanda thulo huna paryo to be valid
  });
  if (!user) {
    return res
      .status(400)
      .json({ message: "Invalid or expired OTP", success: false });
  }
  user.isVerified = true;
  user.emailOTP = undefined;
  user.emailOTPExpire = undefined;
  await user.save();
  //   res.json({ message: "Email verified successfully" });
  //giving token after verifying email auto login if not given then need to login again
  const token = generateToken(user._id, user.name, user.email, user.role);

  res.json({
    message: "User registered successfully",
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.json({
        message: "All fields required",
        success: false,
      });
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "User doesnt exist. Register",
        success: false,
      });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.json({
        message: "Invalid Credentials",
        success: false,
      });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Email not verified", success: false });
    }
    const token = generateToken(user._id, user.name, user.email, user.role);
    console.log(user);
    console.log("object");

    console.log(token);
    console.log("object");
    res.json({
      message: "User logged successfully",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "login in failed", success: false });
  }
}



module.exports = { register, verifyEmail, login };
