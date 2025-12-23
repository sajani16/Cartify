const express = require("express");
const dbConnect = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const dotenv = require("dotenv");
const cloudinaryConfig = require("./config/cloudinary");

const admin = require("./middleware/adminMiddleware");
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.get("/", admin, (req, res) => {
  res.send("Backend running");
});
app.listen(PORT, () => {
  dbConnect();
  cloudinaryConfig();
  console.log("Server Running Successfully.");
});
