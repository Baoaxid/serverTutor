const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/studentRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors()); // Allow CORS for all origins (for development, refine in production)
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello dev");
});

app.use("/api/auth", authRoutes); // Mount auth routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/tutors", tutorRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB();
