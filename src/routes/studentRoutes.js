const express = require("express");
const studentController = require("../controllers/studentController");

const router = express.Router();

router.get("/getTutor/:search?", studentController.getTutor); //? để khi muốn lấy toàn bộ tutor
router.get(
  "/searchClassByTutorName/:search",
  studentController.findClassByTutorNameController
);
router.post("/enrollClass/:id", studentController.enrollClass);
router.post("/unEnrollClass/:id", studentController.unEnrollClass);
router.post("/feedback/:classID", studentController.feedbackClass);

module.exports = router;
