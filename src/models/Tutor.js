const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const sql = require("mssql");

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

  static async findClassByTutorID(tutorID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("tutorID", sql.VarChar, tutorID)
      .query(`SELECT * FROM Classes WHERE tutorID = @tutorID`);
    return result.recordset;
  }

  static async findTutorByTutorID(tutorID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("tutorID", sql.VarChar, tutorID)
      .query(`SELECT * FROM Tutors WHERE tutorID = @tutorID`);
    return result.recordset;
  }

  static async createClass(classroom) {
    const connection = await connectDB();
    const id = await this.createClassID();
    await connection
      .request()
      .input("classID", sql.VarChar, id)
      .input("subjectID", sql.VarChar, classroom.subjectID)
      .input("studentID", sql.VarChar, classroom.studentID)
      .input("PaymentID", sql.Int, classroom.PaymentID)
      .input("length", sql.VarChar, classroom.length) // Ensure this matches the data type of 'length' column
      .input("ClassPerWeek", sql.VarChar, classroom.ClassPerWeek) // Ensure this matches the data type of 'Class/week' column
      .input("type", sql.VarChar, classroom.type)
      .input("description", sql.VarChar, classroom.description)
      .input("price", sql.Float, classroom.price) // Ensure this matches the data type of 'price' column
      .input("tutorID", sql.VarChar, classroom.tutorID)
      .input("className", sql.VarChar, classroom.className)
      .query(
        `INSERT INTO Classes (classID, subjectID, studentID, PaymentID, length, classesPerWeek, type, description, price, tutorID, className)
     VALUES (@classID, @subjectID, @studentID, @PaymentID, @length, @ClassPerWeek, @type, @description, @price, @tutorID, @className)`
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
      .input("price", sql.Float, classroom.price)
      .input("tutorID", sql.VarChar, classroom.tutorID)
      .input("className", sql.VarChar, classroom.className).query(`
            UPDATE Classes
            SET subjectID = @subjectID,
                studentID = @studentID,
                PaymentID = @PaymentID,
                length = @length,
                classesPerWeek = @ClassPerWeek,
                type = @type,
                description = @description,
                price = @price,
                tutorID = @tutorID,
                className = @className
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

  static async findTutorByName(search) {
    const connection = await connectDB();
    if (search == undefined) {
      search = "";
    }
    const result = await connection
      .request()
      .input("search", sql.VarChar, "%" + search + "%")
      .query(
        `SELECT * FROM Tutors WHERE uID in (SELECT userID FROM Users WHERE fullName like @search)`
      );
    return result.recordset;
  }

  static async getRequest(tutorID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("tutorID", sql.VarChar, tutorID)
      .query(`SELECT * FROM Requests WHERE tutorID = @tutorID`);
    return result.recordset;
  }

  static async getRequestByID(requestID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("requestID", sql.Int, requestID)
      .query(`SELECT * FROM Requests WHERE requestID = @requestID`);
    return result.recordset[0];
  }

  static async deleteRequest(requestID) {
    const connection = await connectDB();
    const del = await connection
      .request()
      .input("requestID", sql.VarChar, requestID)
      .query(`DELETE Requests WHERE requestID = @requestID`);
    if (del.rowsAffected > 0) {
      return true;
    } else {
      return null;
    }
  }
}

module.exports = Tutor;
