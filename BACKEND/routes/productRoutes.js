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

const router = express.Router();

router.post("/addProduct", protect, admin, upload.single("image"), addProduct);
router.get("/getProducts", getProducts);
router.get("/getProduct/:id", getProduct);
router.get("/search", searchProduct);
router.put(
  "/updateProduct/:id",
  protect,
  admin,
  upload.single("image"),
  updateProduct
);
router.delete("/deleteProduct/:id", protect, admin, deleteProduct);

module.exports = router;
