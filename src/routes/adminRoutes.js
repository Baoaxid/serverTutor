const express = require("express");
const adminController = require("../controllers/adminController");
const classController = require("../controllers/classController");
const userController = require("../controllers/userController");

const router = express.Router();

router.put("/updateUsers/:id", adminController.updateUser);
router.put("/banUsers/:id", adminController.banUsers);
router.put("/unbanUsers/:id", adminController.unbanUsers);
router.get("/complainList", adminController.getComplainList);
router.get("/classList", classController.getAllClass);
router.get("/modList", userController.getMod);
router.get("/getRequest", adminController.getTutorRequest);
router.get("/getUser", adminController.getAllUser);
router.post("/handleTutor/:id", adminController.handleTutor);

module.exports = router;
