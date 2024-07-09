const sql = require("mssql");
const connectDB = require("../config/db");

class Classroom {
  static async getFeedback(classID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("classID", sql.VarChar, classID).query(`SELECT
    f.feedbackID,
    f.tutorID,
    f.classID,
    u.fullName AS studentName,
    u.avatar as studentAvatar,
    f.feedbackDate as date,
    f.message,
    f.rating
FROM
    Feedbacks f
JOIN
    Students s ON f.studentID = s.studentID
JOIN
    Users u ON s.userID = u.userID
WHERE
    f.classID = @classID`);
    return result.recordset;
  }

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

  static async getAllClassExisted() {
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
              Users u ON t.userID = u.userID;`);
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

  static async findClassroomBySubject(subject) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("subject", sql.VarChar, "%" + subject + "%").query(`SELECT 
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
            WHERE c.subject like @subject;`);
    return result.recordset;
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

  static async DeleteClass(classID) {
    const connection = await connectDB();
    const result = await this.getClassroom(classID);
    const deleted = await connection
      .request()
      .input("classID", sql.VarChar, classID).query(`
        DELETE FROM Classes WHERE classID = @classID`);
    if (deleted.rowsAffected > 0) {
      return result;
    } else {
      return null;
    }
  }
}

module.exports = Classroom;
