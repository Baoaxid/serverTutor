const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const PayOS = require("@payos/node");

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
const payos = new PayOS(
  "20aad468-aaa1-4e74-ac05-6a56d669e909",
  "9f4d1792-eb88-4fb3-9184-6b4d61e9736f",
  "d585d408f91635fb51c818d68bc00834c8f54c3b1b417cb1f5ed64e6ac87eca8"
); // client_id, api_key, checksum_key

app.post("/create-payment", async (req, res) => {
  const order = {
    orderCode: 2,
    amount: 1000,
    description: "Thanh toan don hang",
    items: [
      {
        name: "Mì d hảo hảo ly",
        quantity: 1,
        price: 1000,
      },
    ],
    cancelUrl: "http://localhost:5000/api/users/getAllClass",
    returnUrl: "http://localhost:5000",
  };

  try {
    const paymentLink = await payos.createPaymentLink(order);
    res.status(303).json(paymentLink.checkoutUrl);
  } catch (error) {
    res.status(500).json({ error: "Error creating payment link" });
  }
});
