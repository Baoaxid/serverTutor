const express = require("express");
const {
  findClassroomByTutorID,
  viewStudentInClass,
} = require("../controllers/classController");
const {
  createClasses,
  updateClasses,
  deleteClasses,
} = require("../controllers/tutorController");

const router = express.Router();

router.post("/createClasses", createClasses);
router.post("/updateClasses/:id", updateClasses); //need auth for update
router.delete("/deleteClasses/:id", deleteClasses);
router.post("/findClasses/:search", findClassroomByTutorID);
router.get("/viewStudent/:classID", viewStudentInClass);

module.exports = router;
