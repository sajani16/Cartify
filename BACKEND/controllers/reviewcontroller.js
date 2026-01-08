const Review = require("../models/review");
const Product = require("../models/product");

// -------------------- Add or Update Review --------------------
async function addOrUpdateReview(req, res) {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!comment && (rating === null || rating === undefined))
      return res
        .status(400)
        .json({ message: "You must provide a comment or a rating" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let review = await Review.findOne({ product: productId, user: userId });

    if (review) {
      review.rating = rating ?? review.rating;
      review.comment = comment ?? review.comment;
      await review.save();
      await review.populate("user", "name");
      return res.json({ message: "Review updated", review });
    }

    review = await Review.create({
      product: productId,
      user: userId,
      rating: rating ?? null, // null if no rating
      comment: comment || "",
    });
    await review.populate("user", "name");

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// -------------------- Get Reviews for a Product --------------------
async function getReviews(req, res) {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const ratings = reviews.map((r) => r.rating).filter((v) => v !== null);
    const averageRating = ratings.length
      ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
      : null;

    res.json({ reviews, averageRating, totalReviews: reviews.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// -------------------- Delete Review --------------------
async function deleteReview(req, res) {
  try {
    const { id } = req.params; // review ID
    const { id: userId, role } = req.user;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== userId && role !== "admin")
      return res.status(403).json({ message: "Not allowed" });

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// -------------------- Get Single User Review for Product --------------------
async function getUserReview(req, res) {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({ product: productId, user: userId });
    if (review) await review.populate("user", "name");

    res.json({ review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  addOrUpdateReview,
  getReviews,
  deleteReview,
  getUserReview,
};
