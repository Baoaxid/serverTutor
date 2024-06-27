const dotenv = require("dotenv");
const connectDB = require("../config/db");
const sql = require("mssql");

dotenv.config();

class Payment {
  static async getAllPayment() {
    const connection = await connectDB();
    const result = await connection.request().query(`SELECT * FROM Payment`);
    return result.recordset;
  }
}

module.exports = Payment;
