const Message = require("../models/Message");

class messageController {
  static getMessage = async (req, res) => {
    try {
      const { senderID, receiverID } = req.params;
      if (!senderID) {
        return res.status(404).json({
          message: "Cannot find sender id",
        });
      }
      if (!receiverID) {
        return res.status(404).json({
          message: "Cannot find reciever id",
        });
      }

      const data = await Message.getMessage(senderID, receiverID);
      res.status(200).json({
        message: "Get Message Success!",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in getting message api",
      });
    }
  };

  static sendMessage = async (req, res) => {
    try {
      const { senderID, receiverID } = req.params;
      if (!senderID) {
        return res.status(404).json({
          message: "Cannot find sender id",
        });
      }
      if (!receiverID) {
        return res.status(404).json({
          message: "Cannot find reciever id",
        });
      }
      const message = req.body;

      const data = await Message.sendMessage(message);
      res.status(200).json({
        message: "Send Message Success!",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in sending message api",
      });
    }
  };
}

module.exports = messageController;
