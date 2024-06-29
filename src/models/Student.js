const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

class Student {
  static async sendRequestToTutor(tutorID, studentID, message) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("tutorID", sql.VarChar, tutorID)
      .input("studentID", sql.VarChar, studentID)
      .input("message", sql.VarChar, message)
      .query(
        "INSERT INTO Requests (tutorID, studentID, message) OUTPUT inserted.* VALUES (@tutorID, @studentID, @message)"
      );
    return result.recordset[0];
  }

  static async findStudentByID(studentID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("studentID", sql.VarChar, studentID)
      .query("SELECT * FROM Students WHERE studentID = @studentID");
    return result.recordset[0];
  }

  static async findClassByTutorName(search) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("tutorName", sql.VarChar, "%" + search + "%")
      .query(
        "SELECT * FROM Classes WHERE tutorID in (SELECT tutorID FROM Tutors WHERE uID in (SELECT userID FROM Users WHERE fullName like @tutorName))"
      );
    return result.recordset;
  }

  static async findClassBySubject(subject) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("subject", sql.VarChar, "%" + subject + "%")
      .query(
        "select * from Class where subjectID in (select subjectID from Subject where subjectName like @subject)"
      );
    return result.recordset;
  }

  static async findClassByName(name) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("className", sql.VarChar, "%" + name + "%")
      .query("SELECT * FROM Class WHERE className like @className");
    return result.recordset;
  }

  static async findClassByID(classID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("classID", sql.VarChar, classID)
      .query("SELECT * FROM Classes WHERE classID = @classID");
    return result.recordset[0];
  }

  static async enrollClasses(classID, studentID) {
    const connection = await connectDB();
    const updated = await connection
      .request()
      .input("classID", sql.VarChar, classID)
      .input("studentID", sql.VarChar, studentID)
      .query(
        "UPDATE Classes SET studentID = @studentID WHERE classID = @classID"
      );
    if (updated.rowsAffected > 0) {
      const result = await connection
        .request()
        .input("classID", sql.VarChar, classID)
        .query("SELECT * FROM Classes WHERE classID = @classID");
      return result.recordset[0];
    }
  }

  static async unEnrollClasses(classID) {
    const connection = await connectDB();
    const updated = await connection
      .request()
      .input("classID", sql.VarChar, classID)
      .input("studentID", sql.VarChar, null)
      .query(
        "UPDATE Classes SET studentID = @studentID WHERE classID = @classID"
      );
    if (updated.rowsAffected > 0) {
      const result = await connection
        .request()
        .input("classID", sql.VarChar, classID)
        .query("SELECT * FROM Classes WHERE classID = @classID");
      return result.recordset[0];
    }
  }

  static async sendFeedback(classroom, message, rating) {
    const connection = await connectDB();
    const updated = await connection
      .request()
      .input("tutorID", sql.VarChar, classroom.tutorID)
      .input("studentID", sql.VarChar, classroom.studentID)
      .input("classID", sql.VarChar, classroom.classID)
      .input("message", sql.VarChar, message)
      .input("rating", sql.Int, rating)
      .query(
        "INSERT INTO Feedbacks (tutorID, studentID, classID, message, rating) VALUES (@tutorID, @studentID, @classID, @message, @rating)"
      );
    if (updated.rowsAffected > 0) {
      const avg = await connection
        .request()
        .input("tutorID", sql.VarChar, classroom.tutorID)
        .query(
          "SELECT tutorID, ROUND(AVG(CAST(rating AS FLOAT)), 1) AS avg_rating FROM Feedbacks WHERE tutorID = @tutorID GROUP BY tutorID"
        );
      await connection
        .request()
        .input("tutorID", sql.VarChar, classroom.tutorID)
        .input("rating", sql.VarChar, avg.recordset[0].avg_rating + "")
        .query("UPDATE Tutors SET rating = @rating WHERE tutorID = @tutorID");
      const result = await connection
        .request()
        .input("message", sql.VarChar, message)
        .query("SELECT * FROM Feedbacks");
      return result.recordset[result.recordset.length - 1];
    }
  }
}

module.exports = Student;
