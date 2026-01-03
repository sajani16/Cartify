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

    // pagination params
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 5, 1);
    const skip = (page - 1) * limit;

    // total users count
    const totalUsers = await User.countDocuments();

    // paginated users
    const users = await User.find({})
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
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
    const { name, email, password, role } = req.body;

    // Authorization check
    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Update fields based on role
    if (name) user.name = name;
    if (email && (req.user.id === userId || req.user.role === "admin"))
      user.email = email;

    // Admin can update role
    if (role && req.user.role === "admin") user.role = role;

    // Update password if provided (self only)
    if (password && password.trim() !== "" && req.user.id === userId) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Image upload
    if (req.file) {
      const { secure_url, public_id } = await uploadImage(req.file.path);

      if (user.imageId) await cloudinary.uploader.destroy(user.imageId);

      user.image = secure_url;
      user.imageId = public_id;

      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
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
    return res.status(500).json({ success: false, message: "Server error" });
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
