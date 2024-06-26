const Tutor = require("../models/Tutor");

const createClasses = async (req, res) => {
  try {
    const classroom = req.body;
    console.log(classroom);
    if (
      !classroom.subjectID ||
      //!classroom.studentID ||
      !classroom.PaymentID ||
      !classroom.length ||
      !classroom.ClassPerWeek ||
      !classroom.type ||
      !classroom.description ||
      !classroom.price
    ) {
      return res.status(500).json({
        message: "Please provide all field",
      });
    }
    const data = await Tutor.createClass(classroom);
    if (!data) {
      return res.status(404).json({
        message: "Error in create class in Database",
      });
    }

    return res.status(201).json({
      //created
      message: "Create class success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in create class in Server",
      error,
    });
  }
};

const updateClasses = async (req, res) => {
  try {
    const classID = req.params.id;
    if (!classID) {
      return res.status(404).json({
        message: "Invalid class id",
      });
    }
    const classroom = req.body;
    const data = await Tutor.updateClass(classroom, classID);
    if (!data) {
      return res.status(500).json({
        message: "Error in update Classroom",
      });
    }

    return res.status(500).json({
      message: "Classroom's detail updated",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in update class in Server",
      error,
    });
  }
};

const deleteClasses = async (req, res) => {
  try {
    const classID = req.params.id;
    if (!classID) {
      return res.status(404).json({
        message: "Invalid class id",
      });
    }

    const data = await Tutor.deleteClass(classID);
    if (!data) {
      return res.status(500).json({
        message: "Error in delete Classroom",
      });
    }

    return res.status(500).json({
      message: "Classroom deleted",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in delete class in Server",
      error,
    });
  }
};

module.exports = { createClasses, updateClasses, deleteClasses };
