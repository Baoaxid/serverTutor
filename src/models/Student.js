const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

class Student {
  constructor({ userID, studentID, grade, school }) {
    this.userID = userID;
    this.studentID = studentID;
    this.grade = grade;
    this.school = school;
  }

  static async createStudentID() {
    const connection = await connectDB();
    const result = await connection
      .request()
      .query(
        `SELECT * FROM Students ORDER BY CAST(SUBSTRING(studentID, 2, LEN(studentID)) AS INT) DESC`
      );

    if (!result.recordset[0]) {
      return "S1"; // If there are no students, return the first ID
    } else {
      // Assuming IDs are sorted and the last ID is the latest one
      let lastID = result.recordset[0].studentID;
      const alphabet = lastID.match(/[A-Za-z]+/)[0];
      const number = parseInt(lastID.match(/\d+/)[0]) + 1;
      let newID = alphabet + number;
      return newID;
    }
  }

  static async createStudent(userId, studentData) {
    try {
      await connectDB(); // Ensure database connection
      const studentID = await this.createStudentID();
      await sql.query`
        INSERT INTO Students (userID, studentID, grade, school)
        VALUES (${userId}, ${studentID}, ${studentData.grade}, ${studentData.school});
      `;
      return new Student({
        userID: userId,
        studentID,
        ...studentData,
      });
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  }

  static async updateStudent(userID, studentData) {
    try {
      await connectDB(); // Ensure database connection
      const result = await sql.query`
        UPDATE Students
        SET grade = ${studentData.grade}, school = ${studentData.school}
        OUTPUT inserted.*
        WHERE userID = ${userID};
      `;
      return result.recordset[0];
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  }

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

  static async getRequest(studentID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("studentID", sql.VarChar, studentID)
      .query(`SELECT * FROM Requests WHERE studentID = @studentID`);
    return result.recordset;
  }

  static async findStudentByID(studentID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("studentID", sql.VarChar, studentID)
      .query("SELECT * FROM Students WHERE studentID = @studentID");
    return result.recordset[0];
  }

  static async findStudentByUserID(userID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("userID", sql.Int, userID)
      .query("SELECT * FROM Students WHERE userID = @userID");
    return result.recordset[0];
  }

  static async findClassByTutorName(search) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("tutorName", sql.VarChar, "%" + search + "%")
      .query(
        "SELECT * FROM Classes WHERE tutorID in (SELECT tutorID FROM Tutors WHERE userID in (SELECT userID FROM Users WHERE fullName like @tutorName))"
      );
    return result.recordset;
  }

  static async findClassByName(name) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("className", sql.VarChar, "%" + name + "%")
      .query("SELECT * FROM Classes WHERE className like @className");
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

  static async sendFeedback(classroom, message, rating, date) {
    const connection = await connectDB();
    const updated = await connection
      .request()
      .input("tutorID", sql.VarChar, classroom.tutorID)
      .input("studentID", sql.VarChar, classroom.studentID)
      .input("classID", sql.VarChar, classroom.classID)
      .input("message", sql.VarChar, message)
      .input("date", sql.VarChar, date)
      .input("rating", sql.Int, rating)
      .query(
        "INSERT INTO Feedbacks (tutorID, studentID, classID, message, rating, feedbackDate) OUTPUT inserted.* VALUES (@tutorID, @studentID, @classID, @message, @rating, @date)"
      );
    if (updated) {
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
      return updated;
    }
  }
}

module.exports = Student;
