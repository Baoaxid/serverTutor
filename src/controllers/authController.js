const Tutor = require("../models/Tutor");
const User = require("../models/User");
const Student = require("../models/Student");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class authController {
  static registerStudent = async (req, res) => {
    const {
      email,
      userName,
      password,
      fullName,
      dateOfBirth,
      phone,
      address,
      grade,
      school,
    } = req.body;

    const { avatar } = req.body;
    // console.log(req.files);
    // const avatar = req.files.avatar ? req.files.avatar[0].buffer : null;
    try {
      // Check if user already exists
      let user = await User.findByEmail(email);
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user
      user = await User.create({
        email,
        userName,
        password, // Make sure to hash the password in the User model's create method
        fullName,
        avatar,
        dateOfBirth,
        phone,
        address,
        role: "Student",
        active: 1,
      });

      // Create student
      const student = await Student.createStudent(user.userID, {
        grade,
        school,
      });
      if (!student) {
        return res.status(500).json({
          message: "Cannot create student",
        });
      }
      user = { ...user, ...student };

      // Generate authentication token
      const token = User.generateAuthToken(user);

      res.status(201).json({ token, user });
    } catch (error) {
      console.error("Error registering student:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  static registerTutor = async (req, res) => {
    const {
      email,
      userName,
      password,
      fullName,
      dateOfBirth,
      phone,
      address,
      workplace,
      description,
      avatar, // URL as a string
      identityCard, // URL as a string
      degrees, // URL as a string
    } = req.body;

    try {
      // Check if user already exists
      let user = await User.findByEmail(email);
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user
      user = await User.create({
        email,
        userName,
        password, // Make sure to hash the password in the User model's create method
        fullName,
        avatar,
        dateOfBirth,
        phone,
        address,
        role: "Tutor",
        active: 0, //để inactive khi nào đc duyệt thì tự động active
      });

      // Create tutor
      const tutor = await Tutor.createTutor(user.userID, {
        degrees,
        identityCard,
        workplace,
        description,
      });

      const request = await Tutor.registerTutor(user.userID, tutor.tutorID);
      if (!request) {
        return res.status(500).json({
          message: "Tutor request sent fail",
        });
      }

      user = { ...user, ...tutor };
      // Generate authentication token
      const token = User.generateAuthToken(user);

      res.status(201).json({
        message: "Tutor request sent, please wait for accept",
        token,
        user,
      });
    } catch (error) {
      console.error("Error registering tutor:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  static loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await User.findByEmail(email);
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

      if (user.role == "Student") {
        const student = await Student.findStudentByUserID(user.userID);
        user = { ...user, ...student };
      } else if (user.role == "Tutor") {
        const tutor = await Tutor.findTutorByTutorUserID(user.userID);
        user = { ...user, ...tutor };
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
      const user = req.body.user;
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
