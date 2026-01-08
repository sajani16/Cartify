const express = require("express");
const {
  addOrUpdateReview,
  getReviews,
  deleteReview,
} = require("../controllers/reviewcontroller");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:productId", protect, addOrUpdateReview);
router.get("/:productId", getReviews);
router.delete("/:id", protect, deleteReview);

module.exports = router;
