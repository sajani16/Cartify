const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { uploadImage } = require("../config/uploadImage");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

async function getUsers(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const users = await User.find({}).select("-password");

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

async function getUser(req, res) {
  try {
    const userId = req.params.id;

    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      const { secure_url, public_id } = await uploadImage(req.file.path);

      if (user.imageId) {
        await cloudinary.uploader.destroy(user.imageId);
      }

      user.image = secure_url;
      user.imageId = public_id;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || null,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

async function deleteUser(req, res) {
  try {
    const targetUserId = req.params.id;

    if (req.user.role !== "admin" && req.user.id !== targetUserId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.imageId) {
      await cloudinary.uploader.destroy(user.imageId);
    }

    await User.findByIdAndDelete(targetUserId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
