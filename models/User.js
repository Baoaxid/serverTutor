const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

class User {
  static async findByEmail(email) {
    const connection = await connectDB();
    const result = await connection.query(
      `SELECT userID, userName, fullName, email, password, avatar, dateOfBirth, role, phone, address FROM Users WHERE email = ?`,
      [email]
    );
    return result[0];
  }

  static async create(user) {
    const connection = await connectDB();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await connection.query(
      `INSERT INTO Users (userName, fullName, email, password, dateOfBirth, role, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.userName,
        user.fullName,
        user.email,
        hashedPassword,
        user.dateOfBirth,
        user.role,
        user.phone,
        user.address,
      ]
    );
    return await this.findByEmail(user.email);
  }

  static async updateUser(user) {
    const connection = await connectDB();
    const result = await connection.query(
      `UPDATE Users SET username = ?, fullName = ?, email = ?, avatar = ?, dateOfBirth = ?, phone = ?, address = ? WHERE classID = ?`,
      [
        user.userName,
        user.fullName,
        user.email,
        user.avatar,
        user.dateOfBirth,
        user.phone,
        user.address,
      ]
    );
    return result;
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
