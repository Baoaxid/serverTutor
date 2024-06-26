const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

class Student {
  static async findTutorByName(fullName) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("fullName", sql.VarChar, "%" + fullName + "%")
      .input("role", sql.VarChar, "Tutor")
      .query(
        "SELECT * FROM Tutors WHERE uID in (SELECT userID FROM Users Where fullName LIKE @fullName and role=@role)"
      );
    return result.recordset;
  }

  static async findTutorBySubject(subject) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("subject", sql.VarChar, "%" + subject + "%")
      .input("role", sql.VarChar, "Tutor")
      .query(
        "select * from Tutors where subjectID in (select subjectID from Subject where subjectName like @subject)"
      );
    return result.recordset;
  }

  static async enrollClasses(classID, studentID) {
    const connection = await connectDB();
    const result = connection.query(
      `UPDATE Classes SET studentID = ? WHERE classID = ?`,
      [studentID, classID]
    );
    return result;
  }

  static async unEnrollClasses(classID) {
    const connection = await connectDB();
    const result = connection.query(
      `UPDATE Classes SET studentID = ? WHERE classID = ?`,
      ["", classID]
    );
    return result;
  }
}

module.exports = Student;
