const Tutor = require("../models/Tutor");
const Payment = require("../models/Payment");
const Subject = require("../models/Subject");

const createClasses = async (req, res) => {
  try {
    const classroom = req.body;
    const paymentList = await Payment.getAllPayment();
    const subjectList = await Subject.getAllSubject();
    const isPaymentValid = paymentList.some(
      (payment) => payment.paymentID === classroom.PaymentID
    );
    const isSubjectValid = subjectList.some(
      (subject) => subject.subjectID === classroom.subjectID
    );

    if (!isPaymentValid) {
      return res.status(400).json({
        message: "Invalid PaymentID",
      });
    }

    if (!isSubjectValid) {
      return res.status(400).json({
        message: "Invalid SubjectID",
      });
    }
    if (
      !classroom.className ||
      !classroom.subjectID ||
      //!classroom.studentID ||
      !classroom.PaymentID ||
      !classroom.length ||
      !classroom.ClassPerWeek ||
      !classroom.type ||
      !classroom.description ||
      !classroom.price ||
      !classroom.tutorID
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

    if (classroom.PaymentID) {
      const paymentList = await Payment.getAllPayment();
      const isPaymentValid = paymentList.some(
        (payment) => payment.paymentID == classroom.PaymentID
      );
      if (!isPaymentValid) {
        return res.status(400).json({
          message: "Invalid PaymentID",
        });
      }
    }

    if (classroom.subjectID) {
      const subjectList = await Subject.getAllSubject();
      const isSubjectValid = subjectList.some(
        (subject) => subject.subjectID == classroom.subjectID
      );
      if (!isSubjectValid) {
        return res.status(400).json({
          message: "Invalid SubjectID",
        });
      }
    }

    const data = await Tutor.updateClass(classroom, classID);
    if (!data) {
      return res.status(500).json({
        message: "Error in update Classroom",
      });
    }

    return res.status(200).json({
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

    return res.status(200).json({
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

module.exports = {
  createClasses,
  updateClasses,
  deleteClasses,
  findClassroomByTutorID,
};
