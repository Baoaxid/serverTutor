const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

class Student {
  static async findTutorByName(fullName) {
    const connection = await connectDB();
    const result = await connection.query(
      `SELECT uID, tutorID, degrees, role, identity_card, subject, workplace, description, rating FROM Tutors WHERE uID = (SELECT userID FROM Users WHERE fullName = ?)`,
      [fullName]
    );
    return result[0];
  }

  static async findTutorBySubject(subject) {
    const connection = await connectDB();
    const result = await connection.query(
      `SELECT uID, tutorID, degrees, role, identity_card, subject, workplace, description, rating FROM Tutors WHERE subject = ?`,
      [subject]
    );
    return result[0];
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
