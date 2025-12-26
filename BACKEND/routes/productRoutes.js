const express = require("express");
const admin = require("../middleware/adminMiddleware");
const protect = require("../middleware/authMiddleware");
const { upload } = require("../utils/multer");
const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
} = require("../controllers/productController");

const route = express.Router();

route.post("/addProduct", protect, admin, upload.single("image"), addProduct);
route.get("/getProducts", getProducts);
route.get("/getProduct/:id", getProduct);
route.get("/search", searchProduct);
route.put(
  "/updateProduct/:id",
  protect,
  admin,
  upload.single("image"),
  updateProduct
);
route.delete("/deleteProduct/:id", protect, admin, deleteProduct);

module.exports = route;
