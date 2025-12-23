const express = require("express");
const admin = require("../middleware/adminMiddleware");
const protect = require("../middleware/authMiddleware");
const { upload } = require("../utils/multer");
const { addProduct, getProducts } = require("../controllers/productController");

const route = express.Router();

route.post("/addProduct", protect, admin, upload.single("image"), addProduct);
route.get("/getProducts", getProducts);

module.exports = route;
