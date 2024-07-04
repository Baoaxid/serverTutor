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
        student.grade = updatedUserData.grade;
        student.school = updatedUserData.school;
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
        tutor.degrees = updatedUserData.degrees;
        tutor.identityCard = updatedUserData.identityCard;
        tutor.workplace = updatedUserData.workplace;
        tutor.description = updatedUserData.description;
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
}

module.exports = userController;
