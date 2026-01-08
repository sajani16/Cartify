const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: {
      type: String,
      default: "Product description",
      required: true,
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },

    category: {
      type: String,
      enum: [
        "Espresso",
        "Latte",
        "Cappuccino",
        "Cold Brew",
        "Desserts",
        "Snacks",
        "Others",
      ], // added Other
      required: true,
    },

    image: { type: String, required: true },
    imageId: { type: String, required: true },

    isTrending: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    salePrice: { type: Number }, // optional
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
