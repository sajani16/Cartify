const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null, // optional
    },

    comment: {
      type: String,
      default: "", // optional
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
