const Student = require("../models/Student");
const Tutor = require("../models/Tutor");
const User = require("../models/User");

class userController {
  static getMod = async (req, res) => {
    try {
      const data = await User.getModerator();
      if (!data) {
        return res.status(404).json({
          message: "Cannot find mod list in database",
        });
      }

      res.status(200).json({
        message: "Get mod list success",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in get mod list in Server",
        error,
      });
    }
  };

  static updateUserForUser = async (req, res) => {
    try {
      const userID = req.params.id;
      if (!userID) {
        return res.status(404).json({
          message: "Missing user id",
        });
      }
      const realUser = await User.findUserByID(userID);

      const { updatedUserData } = req.body;
      if (!updatedUserData) {
        return res.status(404).json({
          message: "Cannot found user",
        });
      }

      let updated;
      if (realUser.role == "Student") {
        let student = await Student.findStudentByUserID(userID);
        if (!student) {
          return res.status(404).json({
            message: "Student not found",
          });
        }
        
        student.grade = updatedUserData.grade
          ? updatedUserData.grade
          : student.grade;
        student.school = updatedUserData.school
          ? updatedUserData.school
          : student.school;
        updated = await Student.updateStudent(userID, student);
        if (!updated) {
          return res.status(500).json({
            message: "Student update fail",
          });
        }
      } else if (realUser.role == "Tutor") {
        let tutor = await Tutor.findTutorByTutorUserID(userID);
        if (!tutor) {
          return res.status(404).json({
            message: "Tutor not found",
          });
        }
        tutor.degrees = updatedUserData.degrees
          ? updatedUserData.degrees
          : tutor.degrees;
        tutor.identityCard = updatedUserData.identityCard
          ? updatedUserData.identityCard
          : tutor.identityCard;
        tutor.workplace = updatedUserData.workplace
          ? updatedUserData.workplace
          : tutor.workplace;
        tutor.description = updatedUserData.description
          ? updatedUserData.description
          : tutor.description;
        updated = await Tutor.updateTutor(userID, tutor);
        if (!updated) {
          return res.status(500).json({
            message: "Tutor update fail",
          });
        }
      }

      const data = await User.updateUser(updatedUserData, userID);
      if (!data) {
        return res.status(500).json({
          message: "Error in update user",
        });
      }

      const token = User.generateAuthToken({ ...data, ...updated });
      return res.status(200).json({
        message: "User's detail updated",
        token,
        user: { ...data, ...updated },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in update user in Server",
        error,
      });
    }
  };

  static sendComplains = async (req, res) => {
    try {
      const { userID, message } = req.body;
      if (!userID) {
        return res.status(404).json({
          message: "Cannot find user id",
        });
      }
      if (!message) {
        return res.status(404).json({
          message: "Complain message cannot be blank",
        });
      }

      const data = await User.sendComplain(userID, message);
      res.status(200).json({
        message: "Complain sent!",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in sending complain api",
      });
    }
  };

  static updateUserPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      if (!newPassword) {
        return res.status(400).json({
          message: "New password is required",
        });
      }

      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const updated = await User.updateUserPasswordByEmail(email, newPassword);

      if (!updated) {
        return res.status(500).json({
          message: "Error updating password",
        });
      }

      res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error",
        error,
      });
    }
  };
  
}

module.exports = userController;
