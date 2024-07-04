const express = require("express");
const classController = require("../controllers/classController");
const tutorController = require("../controllers/tutorController");

const router = express.Router();

router.post("/createClasses", tutorController.createClasses);
router.post("/updateClasses/:id", tutorController.updateClasses); //need auth for update
router.delete("/deleteClasses/:id", tutorController.deleteClasses);
router.put("/activeClasses/:id", tutorController.activeClasses);
router.post("/findClasses/:search", classController.findClassroomByTutorID);
router.get("/viewStudent/:classID", classController.viewStudentInClass);
router.get("/viewRequest/:tutorID", tutorController.getRequest);
router.get("/viewFeedback/:classID", classController.getFeedbackByClass);
router.delete("/confirmRequest", tutorController.confirmRequest);

module.exports = router;
