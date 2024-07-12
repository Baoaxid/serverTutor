const express = require("express");
const studentController = require("../controllers/studentController");
const classroomController = require("../controllers/classController");

const router = express.Router();

router.get("/getTutor/:search?", studentController.getTutor); //? để khi muốn lấy toàn bộ tutor
router.get(
  "/searchClassByTutorName/:search",
  studentController.findClassByTutorNameController
);
router.get(
  "/searchTutorByTutorName/:search",
  studentController.findTutorByTutorNameController
);
router.get(
  "/searchClassByClassName/:search",
  studentController.findClassByClassName
);

router.get(
  "/searchClassBySubject/:id",
  classroomController.findClassroomBySubject
);
// router.get("/getTutorEnrolled", studentController.getTutorEnroll);
router.get("/checkEnroll/:id", studentController.checkEnrollStatus);
router.post("/enrollClass/:id", studentController.enrollClass);
router.post("/unEnrollClass/:id", studentController.unEnrollClass);
router.post("/feedback/:classID", studentController.feedbackClass);
router.post("/requestClass/:tutorID", studentController.requestClass);
router.get("/viewRequest/:studentID", studentController.viewRequest);

module.exports = router;
