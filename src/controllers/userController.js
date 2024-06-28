const User = require("../models/User");

const updateUserForUser = async (req, res) => {
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

module.exports = { updateUserForUser };
