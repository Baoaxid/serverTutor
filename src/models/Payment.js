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

  static async createPayment(paymentInfo, tutorID) {
    const connection = await connectDB();
    const { id, orderCode, amount, status, createdAt } = paymentInfo;
    const check = await connection
      .request()
      .input("id", sql.NVarChar, id)
      .query("SELECT COUNT(*) AS count FROM Payments WHERE id = @id");
    if (check.recordset[0].count === 0) {
      const result = await connection
        .request()
        .input("id", sql.NVarChar, id)
        .input("tutorID", sql.VarChar, tutorID)
        .input("orderCode", sql.Int, orderCode)
        .input("amount", sql.Decimal(10, 2), amount)
        .input("status", sql.NVarChar, status)
        .input("createdAt", sql.DateTime, new Date(createdAt))
        .query(`INSERT INTO Payments (id, tutorID, orderCode, amount, status, createdAt) 
        OUTPUT inserted.*
            VALUES (@id, @tutorID, @orderCode, @amount, @status, @createdAt)`);
      return result.recordset[0];
    }
    return check.recordset[0];
  }
  static async getTransaction() {
    const connection = await connectDB();
    const result = await connection.request().query(`SELECT 
              tutorID,
              orderCode,
              amount,
              status,
              createdAt
            FROM 
              payments`);
    return result.recordset;
  }
}

module.exports = Payment;
