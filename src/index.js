const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/studentRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const http = require("http");
const Message = require("./models/Message");

dotenv.config();

const app = express();
app.use(cors()); // Allow CORS for all origins (for development, refine in production)
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("hello dev");
});

app.use("/api/auth", authRoutes); // Mount auth routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/tutors", tutorRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB();

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", async (message) => {
    const { senderID, receiverID, messageText } = message;
    try {
      io.emit("receiveMessage", message);
    } catch (error) {
      console.error("Error saving message to database", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
