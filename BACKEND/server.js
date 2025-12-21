const express = require("express");
const dbConnect = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Backend running");
});
app.listen(PORT, () => {
  dbConnect();
  console.log("Server Running Successfully.");
});
