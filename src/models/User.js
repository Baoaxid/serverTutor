const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

class User {
  static async findByEmail(email) {
    const connection = await connectDB();
    // const result = await connection.query(
    //   `SELECT userID, userName, fullName, email, password, avatar, dateOfBirth, role, phone, address FROM Users WHERE email = ?`,
    //   [email]
    // );
    const result = await connection
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");
    return result.recordset[0];
  }

  static async findUserByID(userID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("userID", sql.Int, userID)
      .query("SELECT * FROM Users WHERE userID = @userID");
    return result.recordset[0];
  }

  static async create(user) {
    const connection = await connectDB();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await connection
      .request()
      .input("userName", sql.NVarChar, user.userName)
      .input("fullName", sql.NVarChar, user.fullName)
      .input("email", sql.VarChar, user.email)
      .input("password", sql.VarChar, hashedPassword)
      .input("avatar", sql.VarChar, user.avatar)
      .input("dateOfBirth", sql.Date, user.dateOfBirth)
      .input("phone", sql.VarChar, user.phone)
      .input("address", sql.NVarChar, user.address)
      .input("active", sql.Int, user.active)
      .query(
        `INSERT INTO Users (userName, fullName, email, password, dateOfBirth, role, phone, address)
         VALUES (@userName, @fullName, @email, @password, @dateOfBirth, @role, @phone, @address)`
      );
    return await this.findByEmail(user.email);
  }

  static async updateUser(user, userID) {
    const connection = await connectDB();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await connection
      .request()
      .input("username", sql.NVarChar, user.userName)
      .input("fullName", sql.NVarChar, user.fullName)
      .input("email", sql.VarChar, user.email)
      .input("password", sql.VarChar, hashedPassword)
      .input("avatar", sql.VarChar, user.avatar)
      .input("dateOfBirth", sql.Date, user.dateOfBirth)
      .input("phone", sql.VarChar, user.phone)
      .input("address", sql.NVarChar, user.address)
      .input("active", sql.Int, user.active)
      .input("userID", sql.Int, userID) // Assuming classID is a foreign key or some identifier
      .query(`
    UPDATE Users
    SET userName = @username,
        fullName = @fullName,
        email = @email,
        password = @password,
        avatar = @avatar,
        dateOfBirth = @dateOfBirth,
        phone = @phone,
        address = @address,
        active = @active
    WHERE userID = @userID;
`);

    if (result.rowsAffected[0] > 0) {
      return await this.findByEmail(user.email);
    } else {
      return null;
    }
  }

  static async banUser(userID) {
    const connection = await connectDB();
    const result = await connection.request().input("userID", sql.Int, userID)
      .query(`
            UPDATE Users
            SET active = 0
            WHERE userID = @userID;
        `);
    const data = await this.findUserByID(userID);
    if (result.rowsAffected[0] > 0) {
      return data;
    } else {
      return null;
    }
  }

  static async unbanUser(userID) {
    const connection = await connectDB();
    const result = await connection.request().input("userID", sql.Int, userID)
      .query(`
            UPDATE Users
            SET active = 1
            WHERE userID = @userID;
        `);
    const data = await this.findUserByID(userID);
    if (result.rowsAffected[0] > 0) {
      return data;
    } else {
      return null;
    }
  }

  static generateAuthToken(user) {
    return jwt.sign(
      { id: user.userID, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;
