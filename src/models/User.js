const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

class User {
  constructor({
    userID,
    userName,
    fullName,
    email,
    password,
    avatar,
    dateOfBirth,
    role,
    phone,
    address,
    active,
  }) {
    this.userID = userID;
    this.userName = userName;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
    this.dateOfBirth = dateOfBirth;
    this.role = role;
    this.phone = phone;
    this.address = address;
    this.active = active;
  }

  static async getModerator() {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("role", sql.VarChar, "Moderator")
      .query(`SELECT * FROM Users WHERE role = @role`);
    return result.recordset;
  }

  static async getAllUser() {
    const connection = await connectDB();
    const result = await connection
      .request()
      .query(
        `SELECT userID, userName, fullName, email, avatar, dateOfBirth, role, phone, address, active FROM Users`
      );
    return result.recordset;
  }

  static async getUsers(userID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("userID", sql.VarChar, userID)
      .query(`SELECT * FROM Users WHERE userID = @userID`);
    return result.recordset[0];
  }

  static async findByEmail(email) {
    const connection = await connectDB();
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
    const result = await connection
      .request()
      .input("userName", sql.NVarChar, user.userName)
      .input("fullName", sql.NVarChar, user.fullName)
      .input("email", sql.VarChar, user.email)
      .input("password", sql.VarChar, hashedPassword)
      .input("avatar", sql.VarChar, user.avatar)
      .input("dateOfBirth", sql.Date, user.dateOfBirth)
      .input("role", sql.VarChar, user.role)
      .input("phone", sql.VarChar, user.phone)
      .input("address", sql.NVarChar, user.address)
      .input("active", sql.Int, user.active)
      .query(
        `INSERT INTO Users (userName, fullName, email, password, avatar, dateOfBirth, role, phone, address, active)
        OUTPUT inserted.*
        VALUES (@userName, @fullName, @email, @password, @avatar, @dateOfBirth, @role, @phone, @address, @active);`
      );
    return result.recordset[0];
  }

  static async updateUserForAdmin(user, userID) {
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

  static async updateUser(user, userID) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("username", sql.NVarChar, user.userName)
      .input("fullName", sql.NVarChar, user.fullName)
      .input("email", sql.VarChar, user.email)
      .input("avatar", sql.VarChar, user.avatar)
      .input("dateOfBirth", sql.Date, user.dateOfBirth)
      .input("phone", sql.VarChar, user.phone)
      .input("address", sql.NVarChar, user.address)
      .input("userID", sql.Int, userID) // Assuming classID is a foreign key or some identifier
      .query(`
    UPDATE Users
    SET userName = @username,
        fullName = @fullName,
        email = @email,
        avatar = @avatar,
        dateOfBirth = @dateOfBirth,
        phone = @phone,
        address = @address
    OUTPUT inserted.*
    WHERE userID = @userID;
`);

    return result.recordset[0];
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

  static async searchRequest(userID) {
    const connection = await connectDB();
    const result = await connection.request().input("userID", sql.Int, userID)
      .query(`
            SELECT * FROM TutorRequests
            WHERE userID = @userID;
        `);
    return result.recordset[0];
  }

  static async getRequest() {
    const connection = await connectDB();
    const result = await connection.request().query(`
            SELECT * FROM TutorRequests
        `);
    return result.recordset;
  }

  static async updateRequestStatus(userID, status) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("userID", sql.Int, userID)
      .input("status", sql.VarChar, status).query(`
            UPDATE TutorRequests
            SET status = @status
            WHERE userID = @userID;
        `);
    if (result.rowsAffected[0] > 0) {
      return true;
    } else {
      return null;
    }
  }

  static generateAuthToken(user) {
    return jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async sendComplain(userID, message) {
    const connection = await connectDB();
    const result = await connection
      .request()
      .input("userID", sql.Int, userID)
      .input("message", sql.NVarChar, message)
      .query(
        `INSERT INTO [dbo].[Complains] ([uID], [message])
          OUTPUT inserted.[complainID], inserted.[uID], inserted.[message]
          VALUES (@userID, @message)`
      );
    return result.recordset[0];
  }

  static async getComplain() {
    const connection = await connectDB();
    const result = await connection.request().query(`SELECT * FROM Complains`);
    return result.recordset;
  }
}

module.exports = User;
