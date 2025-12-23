const { uploadImage } = require("../config/uploadImage");
const Product = require("../models/product");
const fs = require("fs");

//Add Products
async function addProduct(req, res) {
  try {
    const { name, price, stock, category } = req.body;
    const image = req.file;
    const { role } = req.user;
    if (!name || !price || !stock) {
      res.status(400).json({
        message: "Please provide name, price, and stock",
        success: false,
      });
    }
    if (!role == "admin")
      return res.json({
        message: "Only admin can access",
        success: false,
      });
    const { secure_url, public_id } = await uploadImage(image.path);
    const product = await Product.create({
      name,
      price,
      stock,
      category,
      image: secure_url,
      imageId: public_id,
    });
    fs.unlinkSync(image.path);

    res.status(201).json({
      message: "Product added successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product", success: false });
  }
}

//Get Products
async function getProducts(req, res) {
  try {
    const products = await Product.find({});
    if (products.length == 0)
      return res.json({ message: "No products found", success: true });

    return res.json({
      success: true,
      message: "Product fetched successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
}

module.exports = { addProduct, getProducts };
