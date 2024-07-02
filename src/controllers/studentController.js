const Classroom = require("../models/Class");
const Student = require("../models/Student");
const Tutor = require("../models/Tutor");

class studentController {
  static getAllStudent = async (req, res) => {
    try {
      const data = await Student.getAllStudent();
      if (!data) {
        return res.status(404).json({
          message: "Cannot find student list in database",
        });
      }

      res.status(200).json({
        message: "Get student list success",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in get student list in Server",
        error,
      });
    }
  };

  static requestClass = async (req, res) => {
    try {
      const tutorID = req.params.tutorID;
      if (!tutorID) {
        return res.status(404).json({
          message: "Please provide tutor id",
        });
      }
      const tutor = Tutor.findTutorByTutorID(tutorID);
      if (!tutor) {
        return res.status(404).json({
          message: "Cannot find Tutor",
        });
      }

      const { studentID, message } = req.body;

      const data = await Student.sendRequestToTutor(
        tutorID,
        studentID,
        message
      );
      if (!data) {
        return res.status(404).json({
          message: "Cannot send request",
        });
      }

      res.status(200).json({
        message: "Request sent",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "error in send request class to tutor",
        error,
      });
    }
  };

  static findClassByTutorNameController = async (req, res) => {
    try {
      const search = req.params.search;
      const data = await Student.findClassByTutorName(search);
      if (!data) {
        return res.status(404).json({
          message: "Cannot search for class",
        });
      }

      return res.status(200).json({
        message: "Search successfully",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "error in search class by tutor name",
        error,
      });
    }
  };

  static getTutor = async (req, res) => {
    try {
      const search = req.params.search;
      const data = await Tutor.findTutorByName(search);
      if (!data) {
        return res.status(404).json({
          message: "Cannot found tutor",
        });
      }
      return res.status(200).json({
        message: "Searched tutor",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "error in get tutor",
        error,
      });
    }
  };

  static enrollClass = async (req, res) => {
    try {
      const classID = req.params.id;
      const { studentID } = req.body;

      const student = await Student.findStudentByID(studentID);
      if (!student) {
        return res.status(404).json({
          message: "Cannot found student",
        });
      }

      const classroom = await Student.findClassByID(classID);
      if (classroom.studentID) {
        return res.status(409).json({
          message: "Cannot enroll because there still a student in the class",
        });
      }
      if (!classroom.isActive) {
        return res.status(409).json({
          message: "Cannot enroll because the class is deleted",
        });
      }

      let data = await Student.enrollClasses(classID, studentID);
      if (!data) {
        return res.status(404).json({
          message: "Cannot enroll!",
        });
      }
      res.status(200).json({
        message: "Enroll class success",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "error in enroll classes",
        error,
      });
    }
  };

  static unEnrollClass = async (req, res) => {
    try {
      const classID = req.params.id;
      const { studentID } = req.body;
      if (!studentID) {
        return res.status(404).json({
          message: "Please provide student id",
        });
      }

      const student = await Student.findStudentByID(studentID);
      if (!student) {
        return res.status(404).json({
          message: "Cannot found student",
        });
      }

      const classroom = await Student.findClassByID(classID);
      if (classroom.studentID != studentID) {
        return res.status(409).json({
          message:
            "Cannot unenroll because you are not the student in that class",
        });
      }

      let data = await Student.unEnrollClasses(classID);
      if (!data) {
        return res.status(404).json({
          message: "Cannot unenroll!",
        });
      }
      res.status(200).json({
        message: "Unenroll class success",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "error in unenroll classes",
        error,
      });
    }
  };

  static feedbackClass = async (req, res) => {
    try {
      const classID = req.params.classID;
      const { studentID, message, rating } = req.body;

      const classroom = await Student.findClassByID(classID);
      if (classroom.studentID != studentID) {
        return res.status(409).json({
          message:
            "Cannot send feedback because you are not the student in that class",
        });
      }

      let data = await Student.sendFeedback(classroom, message, rating);
      if (!data) {
        return res.status(404).json({
          message: "Cannot send feedback!",
        });
      }

      res.status(200).json({
        message: "Feedback sent!",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "error in sending feedback",
        error,
      });
    }
  };
}

module.exports = studentController;
