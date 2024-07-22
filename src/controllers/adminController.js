const Classroom = require("../models/Class");
const User = require("../models/User");
const { sendApprovalEmail, sendDenialEmail } = require("../email/EmailApproved");
class adminController {
  static getAllUser = async (req, res) => {
    try {
      const data = await User.getAllUser();
      if (!data) {
        return res.status(404).json({
          message: "Cannot find user list",
        });
      }

      return res.status(200).json({
        message: "User list",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in get user in Server",
        error,
      });
    }
  };

  static getActiveUser = async (req, res) => {
    try {
      const data = await User.getActiveUser();
      if (!data) {
        return res.status(404).json({
          message: "Cannot find active user list",
        });
      }

      return res.status(200).json({
        message: "Active user list",
        count: data.length,
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in get active user in Server",
        error,
      });
    }
  };

  static getTutorRequest = async (req, res) => {
    try {
      const data = await User.getRequest();
      if (!data) {
        return res.status(404).json({
          message: "Cannot find request",
        });
      }

      return res.status(200).json({
        message: "Request Tutor list",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in search tutor request in Server",
        error,
      });
    }
  };

  static handleTutor = async (req, res) => {
    try {
      const userID = req.params.id;
      if (!userID) {
        return res.status(404).json({
          message: "Please provide user id",
        });
      }
      const check = await User.searchRequest(userID);
      if (!check) {
        return res.status(404).json({
          message: "Cannot find request of this user",
        });
      }

      const { status } = req.body;

      if (status == "Accept") {
        const data = await User.unbanUser(userID);
        await User.updateRequestStatus(userID, status);
        if (!data) {
          return res.status(500).json({
            message: "Error in confirming tutor",
          });
        }

        // Send approval email
        const user = await User.findUserByID(userID); // Assume you have a method to find user by ID
        if (user && user.email) {
          await sendApprovalEmail(user.email);
        } else {
          return res.status(500).json({
            message: "Error in fetching user email",
          });
        }

        return res.status(200).json({
          message: "Tutor Confirmed",
        });
      } else if (status == "Deny") {
        await User.updateRequestStatus(userID, status);
        const user = await User.findUserByID(userID); // Assume you have a method to find user by ID
        if (user && user.email) {
          await sendDenialEmail(user.email);
        } else {
          return res.status(500).json({
            message: "Error in fetching user email",
          });
        }
        return res.status(200).json({
          message: "Tutor Denied",
        });
      }

      return res.status(500).json({
        message: "Status not correct",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in confirming tutor on server",
        error,
      });
    }
  };

  static deleteClass = async (req, res) => {
    try {
      const classID = req.params.id;
      if (!classID) {
        return res.status(404).json({
          message: "Missing class id",
        });
      }

      const data = await Classroom.DeleteClass(classID);
      if (!data) {
        return res.status(500).json({
          message: "Error in delete class",
        });
      }

      return res.status(200).json({
        message: "Class Deleted",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in delete class in Server",
        error,
      });
    }
  };

  static updateUser = async (req, res) => {
    try {
      const userID = req.params.id;
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
  static deleteComplain = async (req, res) => {
    try {
      const complainID = parseInt(req.params.id);
      const deletedComplain = await User.deleteComplain(complainID);
      if (deletedComplain) {
        return res.status(200).json({
          message: 'Complaint deleted successfully',
          deletedComplain,
        });
      } else {
        return res.status(404).json({
          message: 'Complaint not found',
        });
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      res.status(500).json({
        message: 'Internal server error',
        error,
      });
    }
  };

}

module.exports = adminController;
