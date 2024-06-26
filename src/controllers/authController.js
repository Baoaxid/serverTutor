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

      // Generate authentication token
      const token = User.generateAuthToken(user);

      res.status(201).json({ token, user, student });
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
    } = req.body;

    const { avatar, identityCard, degrees } = req.body;

    // if (!req.files || !req.files.avatar || !req.files.avatar.length) {
    //   return res.status(400).json({ message: "Avatar is required" });
    // }

    // if (!req.files || !req.files.degreeFile || !req.files.degreeFile.length) {
    //   return res.status(400).json({ message: "Degree File is required" });
    // }

    // if (
    //   !req.files ||
    //   !req.files.credentialFile ||
    //   !req.files.credentialFile.length
    // ) {
    //   return res.status(400).json({ message: "credentialFile is required" });
    // }

    // const avatar = req.files.avatar[0].buffer;

    // const identityCard = req.files.credentialFile[0].buffer;
    // const degrees = req.files.degreeFile[0].buffer;

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

      console.log(tutor);

      const request = await Tutor.registerTutor(user.userID, tutor.tutorID);
      if (!request) {
        return res.status(500).json({
          message: "Tutor request sent fail",
        });
      }

      // Generate authentication token
      const token = User.generateAuthToken(user);

      res.status(201).json({
        message: "Tutor request sent, please wait for accept",
        token,
        user,
        tutor,
      });
    } catch (error) {
      console.error("Error registering tutor:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // static registerUser = async (req, res) => {
  //   const { email } = req.body;

  //   try {
  //     let user = await User.findByEmail(email);
  //     if (user) {
  //       return res.status(400).json({ message: "User already exists" });
  //     }

  //     user = await User.create(req.body);
  //     const token = User.generateAuthToken(user);

  //     res.status(201).json({ token, user });
  //   } catch (error) {
  //     console.error("Error registering user:", error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // };

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
      console.log(user);

      if (!user.active) {
        return res.status(403).json({
          message: "User banned!",
        });
      }

      const token = User.generateAuthToken(user);
      if (user.role == "Student") {
        const student = await Student.findStudentByUserID(user.userID);
        res.status(200).json({ token, user, student });
      } else if (user.role == "Tutor") {
        const tutor = await Tutor.findTutorByTutorID(user.userID);
        res.status(200).json({ token, user, tutor });
      } else {
        res.status(200).json({ token, user });
      }
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
