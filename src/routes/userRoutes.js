const express = require("express");
const userController = require("../controllers/userController");
const classController = require("../controllers/classController");

const router = express.Router();

router.put("/update/:id", userController.updateUserForUser);
router.get("/getClass/:id?", classController.getClass);
router.get("/getAllClass", classController.getAllClass);
router.post("/complain", userController.sendComplains);

module.exports = router;
