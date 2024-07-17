const express = require("express");
const userController = require("../controllers/userController");
const classController = require("../controllers/classController");
const tutorController = require("../controllers/tutorController");
const multer = require("multer");
const messageController = require("../controllers/messageController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.put(
  "/update/:id",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  userController.updateUserForUser
);

router.get("/getClass/:id?", classController.getClass);
router.get("/getAllClass", classController.getAllClass);
router.get("/getTutor/:id", tutorController.getTutor);
router.post("/complain", userController.sendComplains);
router.get("/getMessage/:senderID&:receiverID", messageController.getMessage);
router.post(
  "/sendMessage/:senderID&:receiverID",
  messageController.sendMessage
);




module.exports = router;
