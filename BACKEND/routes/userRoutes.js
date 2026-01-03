const express = require("express");
const admin = require("../middleware/adminMiddleware");

const protect = require("../middleware/authMiddleware");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

router.get("/getusers", protect, admin, getUsers);
router.get("/getuser/:id", protect, getUser);
router.put("/updateuser/:id", protect, updateUser);
router.delete("/deleteuser/:id", protect, deleteUser);
module.exports = router;
