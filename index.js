const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

app.use(cors()); // Allow CORS for all origins (for development, refine in production)
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello dev");
});

app.use("/api/auth", authRoutes); // Mount auth routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
