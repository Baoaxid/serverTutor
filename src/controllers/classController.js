const Tutor = require("../models/Tutor");

const paymentList = await Payment.getAllPayment();
const subjectList = await Subject.getAllSubject();

const createClasses = async (req, res) => {
  try {
    const classroom = req.body;
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
