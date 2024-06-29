const User = require("../models/User");

class authController {
  static registerUser = async (req, res) => {
    const { email } = req.body;

    try {
      let user = await User.findByEmail(email);
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = await User.create(req.body);
      const token = User.generateAuthToken(user);

      res.status(201).json({ token, user });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  static loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Wrong Password" });
      }

      if (!user.active) {
        return res.status(403).json({
          message: "User banned!",
        });
      }

      const token = User.generateAuthToken(user);
      res.status(200).json({ token, user });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  static fetchUserProfile = async (req, res) => {
    try {
      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
}

module.exports = authController;
