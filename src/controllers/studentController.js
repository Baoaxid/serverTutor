const Student = require("../models/Student");

const getTutor = async (req, res) => {
  try {
    const { fullName, subject } = req.body;
    let data;
    if (fullName) {
      data = await Student.findTutorByName(fullName);
    } else {
      data = await Student.findTutorBySubject(subject); //tutor éo có subject???
    }
    if (!data) {
      return res.status(404).json({
        message: "Cannot found tutor",
      });
    }
    res.status(200).json({
      message: "Searched tutor",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error in get tutor",
      error,
    });
  }
};

module.exports = { getTutor };
