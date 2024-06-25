const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  fetchUserProfile,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, fetchUserProfile);

module.exports = router;
