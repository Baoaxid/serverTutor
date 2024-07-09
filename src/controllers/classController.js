const Tutor = require("../models/Tutor");
const Classroom = require("../models/Class");

class classController {
  static getFeedbackByClass = async (req, res) => {
    try {
      const classID = req.params.classID;
      if (!classID) {
        return res.status(404).json({
          message: "Please provide class id",
        });
      }

      const classroom = Classroom.getClassroom(classID);
      if (!classroom) {
        return res.status(404).json({
          message: "Cannot find classroom",
        });
      }

      const data = await Classroom.getFeedback(classID);
      if (!data) {
        return res.status(404).json({
          message: "Cannot get feedback",
        });
      }

      res.status(200).json({
        message: "Feedback get success",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "error in get feedback by class",
        error,
      });
    }
  };

  static getAllClass = async (req, res) => {
    try {
      const data = await Classroom.getAllClass();
      if (!data) {
        return res.status(404).json({
          message: "Cannot find class list in database",
        });
      }

      res.status(200).json({
        message: "Get class list success",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in get class list in Server",
        error,
      });
    }
  };

  static getAllClassExisted = async (req, res) => {
    try {
      const data = await Classroom.getAllClassExisted();
      if (!data) {
        return res.status(404).json({
          message: "Cannot find class list in database",
        });
      }

      res.status(200).json({
        message: "Get class list success",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in get class list in Server",
        error,
      });
    }
  };

  static getClass = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(404).json({
          message: "Please provide class id",
        });
      }
      const data = await Classroom.getClassroom(id);
      if (!data) {
        return res.status(404).json({
          message: "Cannot found Class",
        });
      }

      res.status(200).json({
        message: "Found classroom",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in get class in Server",
        error,
      });
    }
  };

  static findClassroomByTutorID = async (req, res) => {
    try {
      const tutorID = req.params.search;
      if (!tutorID) {
        return res.status(404).json({
          message: "Please provide tutorID",
        });
      }

      const classroom = await Tutor.findClassByTutorID(tutorID);
      if (!classroom) {
        return res.status(500).json({
          message: "Error in find classroom by tutor id",
        });
      }

      return res.status(200).json({
        message: "Found classroom",
        classroom,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in find class in Server",
        error,
      });
    }
  };

  static findClassroomBySubject = async (req, res) => {
    try {
      const subject = req.params.id;
      if (!subject) {
        return res.status(404).json({
          message: "Please provide subject",
        });
      }

      const classroom = await Classroom.findClassroomBySubject(subject);
      if (!classroom) {
        return res.status(500).json({
          message: "Error in find classroom by subject",
        });
      }

      return res.status(200).json({
        message: "Found classroom",
        classroom,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in found class in Server",
        error,
      });
    }
  };

  static viewStudentInClass = async (req, res) => {
    try {
      const classID = req.params.classID;
      if (!classID) {
        return res.status(404).json({
          message: "Please provide classID",
        });
      }

      const tutorID = req.body.tutorID;
      if (!tutorID) {
        return res.status(404).json({
          message: "Cannot find tutorID",
        });
      }
      const classroom = await Classroom.getClassroom(classID);
      if (!classroom) {
        return res.status(404).json({
          message: "Cannot find classes",
        });
      }
      const student = await Classroom.viewStudent(classID);
      if (!student) {
        return res.status(500).json({
          message: "Error in find student by class id",
        });
      }
      if (tutorID == classroom.tutorID) {
        return res.status(200).json({
          message: "Found student",
          student,
        });
      } else {
        return res.status(404).json({
          message: "Tutor cannot view student not in your class",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in find student in class in Server",
        error,
      });
    }
  };
}

module.exports = classController;
