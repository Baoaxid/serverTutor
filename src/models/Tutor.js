const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const sql = require("mssql");

dotenv.config();

class Tutor {
  constructor({
    userID,
    tutorID,
    degrees,
    identityCard,
    workplace,
    description,
  }) {
    this.userID = userID;
    this.tutorID = tutorID;

    this.degrees = degrees;
    this.identityCard = identityCard;
    this.workplace = workplace;
    this.description = description;
  }

  static async registerTutor(userId, tutorID) {
    try {
      await connectDB(); // Ensure database connection
      const result = await sql.query`
        INSERT INTO TutorRequests (userID, tutorID, status)
        OUTPUT inserted.*
        VALUES (${userId}, ${tutorID}, ${"Pending"});
      `;
      return result;
    } catch (error) {
      console.error("Error creating tutor request:", error);
      throw error;
    }
  }

  static async createTutorID() {
    const connection = await connectDB();
    const result = await connection
      .request()
      .query(
        `SELECT * FROM Tutors ORDER BY CAST(SUBSTRING(tutorID, 2, LEN(tutorID)) AS INT) DESC`
      );
    if (!result.recordset[0]) {
      let id = "T1";
      return id;
    } else {
      let id = result.recordset[0].tutorID;
      const alphabet = id.match(/[A-Za-z]+/)[0];
      const number = parseInt(id.match(/\d+/)[0]) + 1;
      id = alphabet + number;
      return id;
    }
  }

  static async createTutor(userID, tutorData) {
    try {
      await connectDB(); // Ensure database connection
      const tutorID = await this.createTutorID();
      await sql.query`
        INSERT INTO Tutors (userID, tutorID, degrees, identityCard, workplace, description)
        VALUES (${userID}, ${tutorID}, ${tutorData.degrees}, ${tutorData.identityCard}, 
                ${tutorData.workplace}, ${tutorData.description});
      `;
      return new Tutor({
        userID,
        tutorID,
        ...tutorData,
      });
    } catch (error) {
      console.error("Error creating tutor:", error);
      throw error;
    }
  }

  static async updateTutor(userID, tutorData) {
    try {
      await connectDB(); // Ensure database connection
      await sql.query`
        UPDATE Tutors
        SET degrees = ${tutorData.degrees},
            identityCard = ${tutorData.identityCard},
            workplace = ${tutorData.workplace},
            description = ${tutorData.description}
        WHERE userID = ${userID};
      `;
      return this.findTutorByTutorUserID(userID);
    } catch (error) {
      console.error("Error updating tutor:", error);
      throw error;
    }
  }

  static async getTutor(userID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("userID", sql.Int, userID)
      .query(
        `SELECT u.userID, u.fullName, t.tutorID, t.description, t.degrees, t.rating FROM Users u JOIN Tutors t ON u.userID = t.userID WHERE u.userID = @userID`
      );
    return result.recordset[0];
  }

  static async findClassroom(classroomID) {
    const connection = await connectDB();
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

  static async findTutorByTutorUserID(userID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("userID", sql.Int, userID)
      .query(`SELECT * FROM Tutors WHERE userID = @userID`);
    return result.recordset[0];
  }

  static async createClass(classroom) {
    const connection = await connectDB();
    const id = await this.createClassID();
    const result = await connection
      .request()
      .input("classID", sql.VarChar, id)
      .input("subject", sql.VarChar, classroom.subject)
      .input("studentID", sql.VarChar, classroom.studentID)
      .input("PaymentID", sql.Int, classroom.PaymentID)
      .input("length", sql.VarChar, classroom.length) // Ensure this matches the data type of 'length' column
      .input("available", sql.VarChar, classroom.available)
      .input("type", sql.VarChar, classroom.type)
      .input("description", sql.VarChar, classroom.description)
      .input("price", sql.Float, classroom.price) // Ensure this matches the data type of 'price' column
      .input("tutorID", sql.VarChar, classroom.tutorID)
      .input("className", sql.VarChar, classroom.className)
      .input("videoLink", sql.VarChar, classroom.videoLink)
      .query(
        `INSERT INTO Classes (classID, subject, studentID, PaymentID, length, available, type, description, price, tutorID, className, videoLink)
        OUTPUT inserted.*
     VALUES (@classID, @subject, @studentID, @PaymentID, @length, @available, @type, @description, @price, @tutorID, @className, @videoLink)`
      );
    return result.recordset[0];
  }

  static async createClassID() {
    const connection = await connectDB();
    const result = await connection
      .request()
      .query(
        `SELECT * FROM Classes ORDER BY CAST(SUBSTRING(classID, 2, LEN(classID)) AS INT) DESC`
      );
    if (!result.recordset[0]) {
      let id = "C1";
      return id;
    } else {
      let id = result.recordset[0].classID;

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
      .input("subject", sql.VarChar, classroom.subject)
      .input("studentID", sql.VarChar, classroom.studentID)
      .input("PaymentID", sql.Int, classroom.PaymentID)
      .input("length", sql.VarChar, classroom.length) // Ensure this matches the data type of 'length' column
      .input("available", sql.VarChar, classroom.available)
      .input("type", sql.VarChar, classroom.type)
      .input("description", sql.VarChar, classroom.description)
      .input("price", sql.Float, classroom.price) // Ensure this matches the data type of 'price' column
      .input("tutorID", sql.VarChar, classroom.tutorID)
      .input("className", sql.VarChar, classroom.className)
      .input("videoLink", sql.VarChar, classroom.videoLink).query(`
            UPDATE Classes
            SET subject = @subject,
                studentID = @studentID,
                PaymentID = @PaymentID,
                length = @length,
                available = @available,
                type = @type,
                description = @description,
                price = @price,
                tutorID = @tutorID,
                className = @className,
                videoLink = @videoLink
            OUTPUT inserted.*
            WHERE classID = @classID;
        `);
    return result.recordset[0];
  }

  static async deleteClass(classID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("classID", sql.VarChar, classID).query(`
            UPDATE Classes SET isActive = 0
            OUTPUT inserted.*
            WHERE classID = @classID;
        `);
    return result.recordset[0];
  }

  static async activeClasses(classID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("classID", sql.VarChar, classID).query(`
            UPDATE Classes SET isActive = 1
            OUTPUT inserted.*
            WHERE classID = @classID;
        `);
    return result.recordset[0];
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
        `SELECT Tutors.*, Users.fullName
FROM Tutors
JOIN Users ON Tutors.userID = Users.userID
WHERE Users.fullName LIKE @search;`
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
