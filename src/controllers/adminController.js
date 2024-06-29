const User = require("../models/User");

class adminController {
  static updateUser = async (req, res) => {
    try {
      const userID = req.params.id;
      console.log(userID);
      if (!userID) {
        return res.status(404).json({
          message: "Missing user id",
        });
      }
      const user = req.body;
      if (!user) {
        return res.status(404).json({
          message: "Cannot found user",
        });
      }

      const data = await User.updateUserForAdmin(user, userID);
      if (!data) {
        return res.status(500).json({
          message: "Error in update user",
        });
      }

      return res.status(200).json({
        message: "User's detail updated",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in update user in Server",
        error,
      });
    }
  };

  static banUsers = async (req, res) => {
    try {
      const userID = req.params.id;
      if (!userID) {
        return res.status(404).json({
          message: "Please provide user id",
        });
      }

      const data = await User.banUser(userID);
      if (!data) {
        return res.status(500).json({
          message: "Error in ban user",
        });
      }

      return res.status(200).json({
        message: "User banned",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in ban user in Server",
        error,
      });
    }
  };

  static unbanUsers = async (req, res) => {
    try {
      const userID = req.params.id;
      if (!userID) {
        return res.status(404).json({
          message: "Please provide user id",
        });
      }

      const data = await User.unbanUser(userID);
      if (!data) {
        return res.status(500).json({
          message: "Error in unban user",
        });
      }

      return res.status(200).json({
        message: "User unbanned",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in unban user in Server",
        error,
      });
    }
  };

  static getComplainList = async (req, res) => {
    try {
      const data = await User.getComplain();
      if (!data) {
        return res.status(500).json({
          message: "Error in getting complain list",
        });
      }

      return res.status(200).json({
        message: "Get complain list success",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in getting complain list in Server",
        error,
      });
    }
  };
}

module.exports = adminController;
