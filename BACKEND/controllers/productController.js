const { uploadImage, deleteImage } = require("../config/uploadImage");
const Product = require("../models/product");
const fs = require("fs");

//Add Products
async function addProduct(req, res) {
  try {
    const { name, price, stock, category } = req.body;
    const image = req.file;
    const { role } = req.user;
    if (!name || !price || !stock) {
      return res.status(400).json({
        message: "Please provide name, price, and stock",
        success: false,
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    if (role !== "admin")
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
    console.log(product);
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const products = await Product.find({}).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();

    if (products.length == 0)
      return res.json({ message: "No products found", success: true });

    return res.json({
      success: true,
      message: "Product fetched successfully",
      products,
      currentPage: page,
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

async function getProduct(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json({ message: "Id required", success: false });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.json({
        message: "No product found",
        success: true,
      });
    }
    res.json({
      message: "Showing product details",
      success: true,
      product,
    });
  } catch (error) {}
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, price, stock, category, description } = req.body;
    const image = req.file;
    const { role } = req.user;
    const product = await Product.findById(id);
    if (!product) {
      return res.json({
        success: true,
        message: "No product found",
      });
    }
    if (role !== "admin")
      return res.json({
        message: "Only admin can access",
        success: false,
      });
    if (image) {
      await deleteImage(product.imageId);
      const { secure_url, public_id } = await uploadImage(image.path);
      product.image = secure_url;
      product.imageId = public_id;
      fs.unlinkSync(image.path);
    }
    const updateProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        stock,
        category,
        image: product.image,
        imageId: product.imageId,
      },
      { new: true }
    );
    console.log("object");
    return res.json({
      success: true,
      message: "Updated successfully",
      product: updateProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.user;
    const product = await Product.findById(id);
    if (!product) {
      return res.json({
        success: true,
        message: "No product found",
      });
    }
    if (role !== "admin")
      return res.json({
        message: "Only admin can access",
        success: false,
      });
    if (product.image) {
      await deleteImage(product.imageId);
    }
    const deleted = await Product.findByIdAndDelete(id);
    return res.json({
      success: true,
      message: "Deleted successfully",
      deleted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
}
async function searchProduct(req, res) {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 2,
    } = req.query;
    let query = {};

    //search by name
    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }
    //search by category
    if (category) {
      query.category = category;
    }
    //Price
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(query).skip(skip).limit(Number(limit));
    if (!products) {
      return res.json({
        success: true,
        message: "No related product found",
      });
    }
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch products", error: error });
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
