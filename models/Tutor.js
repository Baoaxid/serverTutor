const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

class Tutor {
  static async findClassroom(classroom) {
    const connection = await connectDB();
    const result = await connection.query(
      `SELECT classID, subject, studentID, PaymentID, length, Class/week, type, description, price FROM Classes WHERE classID = ?`,
      [classroom.classID]
    );
    return result[0];
  }

  static async createClasses(classroom) {
    const connection = await connectDB();
    await connection.query(
      `INSERT INTO Classes (classID, subject, studentID, PaymentID, length, Class/week, type, description, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        classroom.classID,
        classroom.subject,
        classroom.studentID,
        classroom.PaymentID,
        classroom.ClassPerWeek,
        classroom.type,
        classroom.description,
        classroom.price,
      ]
    );
    return await this.findClassroom(classroom.classID);
  }

  static async updateClass(classroom) {
    const result = await connection.query(
      `UPDATE Classes SET subject = ?, studentID = ?, PaymentID = ?, ClassPerWeek = ?, type = ?, description = ?, price = ? WHERE classID = ?`,
      [
        classroom.subject,
        classroom.studentID,
        classroom.PaymentID,
        classroom.ClassPerWeek,
        classroom.type,
        classroom.description,
        classroom.price,
        classroom.classID,
      ]
    );
    return result;
  }

  static async deleteClasses(classroom) {
    const connection = await connectDB();
    const result = await connection.query(
      `DELETE FROM Classes WHERE classID = ?`,
      [classroom.classID]
    );
    return result;
  }
}

module.exports = Tutor;
