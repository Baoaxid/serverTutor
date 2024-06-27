const dotenv = require("dotenv");
const connectDB = require("../config/db");
const sql = require("mssql");

dotenv.config();

class Subject {
  static async getAllSubject() {
    const connection = await connectDB();
    const result = await connection.request().query(`SELECT * FROM Subject`);
    return result.recordset;
  }
}

module.exports = Subject;
