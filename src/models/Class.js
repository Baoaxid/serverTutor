const sql = require("mssql");
const connectDB = require("../config/db");

class Classroom {
  static async getAllClass() {
    const connection = await connectDB();
    const result = await connection.request().query(`SELECT * FROM Classes`);
    return result.recordset;
  }

  static async getClassroom(classID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("classID", sql.VarChar, classID)
      .query(`SELECT * FROM Classes WHERE classID = @classID`);
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
