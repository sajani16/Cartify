const { uploadImage, deleteImage } = require("../config/uploadImage");
const Product = require("../models/product");
const Review = require("../models/review");
const fs = require("fs");

// -------------------- Add Product --------------------
async function addProduct(req, res) {
  try {
    const {
      name,
      price,
      stock,
      category,
      description,
      isTrending,
      isOnSale,
      salePrice,
    } = req.body;

    const image = req.file;
    const { role } = req.user;

    if (role !== "admin")
      return res
        .status(403)
        .json({ success: false, message: "Only admin can access" });

    if (!name || !price || !stock || !category || !image)
      return res.status(400).json({
        success: false,
        message: "Name, price, stock, category, and image are required",
      });

    // Ensure category matches enum exactly
    const allowedCategories = [
      "Espresso",
      "Latte",
      "Cappuccino",
      "Cold Brew",
      "Desserts",
      "Snacks",
      "Others",
    ];
    if (!allowedCategories.includes(category))
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });

    const { secure_url, public_id } = await uploadImage(image.path);

    const product = await Product.create({
      name,
      price,
      stock,
      category,
      description: description || "Product description",
      image: secure_url,
      imageId: public_id,
      isTrending: isTrending || false,
      isOnSale: isOnSale || false,
      salePrice: salePrice || null,
    });

    fs.unlinkSync(image.path);

    res
      .status(201)
      .json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding product" });
  }
}

// -------------------- Get All Products --------------------
async function getProducts(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      isTrending,
      isOnSale,
      sort = "latest",
    } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (category) query.category = category; // no lowercasing
    if (isTrending) query.isTrending = isTrending === "true";
    if (isOnSale) query.isOnSale = isOnSale === "true";

    let productsQuery = Product.find(query).skip(skip).limit(Number(limit));

    if (sort === "latest")
      productsQuery = productsQuery.sort({ createdAt: -1 });
    if (sort === "priceAsc") productsQuery = productsQuery.sort({ price: 1 });
    if (sort === "priceDesc") productsQuery = productsQuery.sort({ price: -1 });

    const products = await productsQuery;
    const totalProducts = await Product.countDocuments(query);

    res.json({
      success: true,
      message: "Products fetched successfully",
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
}

// -------------------- Get Single Product (with Reviews) --------------------
async function getProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const reviews = await Review.find({ product: id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const ratings = reviews.map((r) => r.rating).filter(Boolean);
    const averageRating = ratings.length
      ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
      : null;

    res.json({
      success: true,
      message: "Product details",
      product,
      reviews,
      averageRating,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product" });
  }
}

// -------------------- Update Product --------------------
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      stock,
      category,
      description,
      isTrending,
      isOnSale,
      salePrice,
    } = req.body;
    const image = req.file;
    const { role } = req.user;

    if (role !== "admin")
      return res
        .status(403)
        .json({ success: false, message: "Only admin can access" });

    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (category) {
      const allowedCategories = [
        "Espresso",
        "Latte",
        "Cappuccino",
        "Cold Brew",
        "Desserts",
        "Snacks",
        "Others",
      ];
      if (!allowedCategories.includes(category))
        return res
          .status(400)
          .json({ success: false, message: "Invalid category" });
      product.category = category;
    }

    if (image) {
      if (product.imageId) await deleteImage(product.imageId);
      const { secure_url, public_id } = await uploadImage(image.path);
      product.image = secure_url;
      product.imageId = public_id;
      fs.unlinkSync(image.path);
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.description = description || product.description;
    product.isTrending = isTrending ?? product.isTrending;
    product.isOnSale = isOnSale ?? product.isOnSale;
    product.salePrice = salePrice ?? product.salePrice;

    await product.save();
    res.json({ success: true, message: "Product updated", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
}

// -------------------- Delete Product --------------------
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.user;
    if (role !== "admin")
      return res
        .status(403)
        .json({ success: false, message: "Only admin can access" });

    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (product.imageId) await deleteImage(product.imageId);

    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
}

// -------------------- Search Products --------------------
async function searchProduct(req, res) {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;
    const query = {};

    if (keyword) query.name = { $regex: keyword, $options: "i" };
    if (category) query.category = category; // exact match
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(query).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Search failed" });
  }
}

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
};
