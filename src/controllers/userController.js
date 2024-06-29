const User = require("../models/User");

class userController {
  static updateUserForUser = async (req, res) => {
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

      const data = await User.updateUser(user, userID);
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

  static sendComplains = async (req, res) => {
    try {
      const { userID, message } = req.body;
      if (!userID) {
        return res.status(404).json({
          message: "Cannot find user id",
        });
      }
      if (!message) {
        return res.status(404).json({
          message: "Complain message cannot be blank",
        });
      }

      const data = await User.sendComplain(userID, message);
      res.status(200).json({
        message: "Complain sent!",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in sending complain api",
      });
    }
  };
}

module.exports = userController;
