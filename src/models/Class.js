const sql = require("mssql");
const connectDB = require("../config/db");

class Classroom {
  static async getAllClass() {
    const connection = await connectDB();
    const result = await connection.request().query(`SELECT 
              c.classID,
              c.className,
              c.videoLink,
              c.subject,
              c.tutorID,
              t.userID,
              u.fullName AS tutorFullName,
              c.studentID,
              c.paymentID,
              c.length,
              c.available,
              c.type,
              c.description,
              c.price,
              t.rating,
              c.isActive
            FROM 
              Classes c
            JOIN 
              Tutors t ON c.tutorID = t.tutorID
            JOIN 
              Users u ON t.userID = u.userID 
            WHERE c.isActive = 1;`);
    return result.recordset;
  }

  static async getClassroom(classID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("classID", sql.VarChar, classID).query(`SELECT 
              c.classID,
              c.className,
              c.videoLink,
              c.subject,
              c.tutorID,
              t.userID,
              u.fullName AS tutorFullName,
              c.studentID,
              c.paymentID,
              c.length,
              c.available,
              c.type,
              c.description,
              c.price,
              t.rating,
              c.isActive
            FROM 
              Classes c
            JOIN 
              Tutors t ON c.tutorID = t.tutorID
            JOIN 
              Users u ON t.userID = u.userID 
            WHERE c.classID = @classID;`);
    return result.recordset[0];
  }

  static async viewStudent(classID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("classID", sql.VarChar, classID).query(`
        SELECT Students.studentID, fullName, Students.grade, Students.school FROM Users
        JOIN Students ON Users.userID = Students.userID
        WHERE Students.studentID = (SELECT studentID FROM Classes WHERE classID = @classID)`);
    return result.recordset[0];
  }
}

module.exports = Classroom;
