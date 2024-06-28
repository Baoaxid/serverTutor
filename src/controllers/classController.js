const Tutor = require("../models/Tutor");
const Classroom = require("../models/Class");

const getClass = async (req, res) => {
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

const findClassroomByTutorID = async (req, res) => {
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
      message: "Error in delete class in Server",
      error,
    });
  }
};

const viewStudentInClass = async (req, res) => {
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

module.exports = {
  findClassroomByTutorID,
  getClass,
  viewStudentInClass,
};
