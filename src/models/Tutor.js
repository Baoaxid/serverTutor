const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const sql = require("mssql");
const Payment = require("./Payment");
const Subject = require("./Subject");

dotenv.config();

class Tutor {
  static async findClassroom(classroomID) {
    const connection = await connectDB();
    // const result = await connection.query(
    //   `SELECT classID, subject, studentID, PaymentID, length, Class/week, type, description, price FROM Classes WHERE classID = ?`,
    //   [classroom.classID]
    // );
    const result = await connection
      .request()
      .input("classID", sql.VarChar, classroomID)
      .query(`SELECT * FROM Classes WHERE classID = @classID`);
    return result.recordset[0];
  }

  static async createClass(classroom) {
    const connection = await connectDB();
    const id = await this.createClassID();
    await connection
      .request()
      .input("classID", sql.VarChar, id)
      .input("subjectID", sql.VarChar, classroom.subjectID)
      .input("studentID", sql.VarChar, "")
      .input("PaymentID", sql.Int, classroom.PaymentID)
      .input("length", sql.VarChar, classroom.length) // Ensure this matches the data type of 'length' column
      .input("ClassPerWeek", sql.VarChar, classroom.ClassPerWeek) // Ensure this matches the data type of 'Class/week' column
      .input("type", sql.VarChar, classroom.type)
      .input("description", sql.VarChar, classroom.description)
      .input("price", sql.Float, classroom.price) // Ensure this matches the data type of 'price' column
      .query(
        `INSERT INTO Classes (classID, subjectID, studentID, PaymentID, length, classesPerWeek, type, description, price)
     VALUES (@classID, @subjectID, @studentID, @PaymentID, @length, @ClassPerWeek, @type, @description, @price)`
      );
    return await this.findClassroom(id);
  }

  static async createClassID() {
    const connection = await connectDB();
    const result = await connection.request().query(`SELECT * FROM Classes`);
    if (!result.recordset[0]) {
      let id = "C1";
      return id;
    } else {
      let id = result.recordset[result.recordset.length - 1].classID;
      const alphabet = id.match(/[A-Za-z]+/)[0];
      const number = parseInt(id.match(/\d+/)[0]) + 1;
      id = alphabet + number;
      return id;
    }
  }

  static async updateClass(classroom, classID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("classID", sql.VarChar, classID)
      .input("subjectID", sql.VarChar, classroom.subjectID)
      .input("studentID", sql.VarChar, classroom.studentID)
      .input("PaymentID", sql.Int, classroom.PaymentID)
      .input("length", sql.VarChar, classroom.length)
      .input("ClassPerWeek", sql.VarChar, classroom.ClassPerWeek)
      .input("type", sql.VarChar, classroom.type)
      .input("description", sql.VarChar, classroom.description)
      .input("price", sql.Float, classroom.price).query(`
            UPDATE Classes
            SET subjectID = @subjectID,
                studentID = @studentID,
                PaymentID = @PaymentID,
                length = @length,
                classesPerWeek = @ClassPerWeek,
                type = @type,
                description = @description,
                price = @price
            WHERE classID = @classID;
        `);
    if (result.rowsAffected[0] > 0) {
      return await this.findClassroom(classID);
    } else {
      return null;
    }
  }

  static async deleteClass(classId) {
    const connection = await connectDB();
    const data = await this.findClassroom(classId);
    const result = await connection
      .request()
      .input("classID", sql.VarChar, classId).query(`
            DELETE FROM Classes
            WHERE classID = @classID;
        `);
    if (result.rowsAffected[0] > 0) {
      return data;
    } else {
      return null;
    }
  }
}

module.exports = Tutor;
