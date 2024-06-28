const express = require("express");
const {
  getTutor,
  enrollClass,
  unEnrollClass,
  findClassByTutorNameController,
  feedbackClass,
} = require("../controllers/studentController");

const router = express.Router();

router.get("/getTutor/:search?", getTutor); //? để khi muốn lấy toàn bộ tutor
router.get("/searchClassByTutorName/:search", findClassByTutorNameController);
router.post("/enrollClass/:id", enrollClass);
router.post("/unEnrollClass/:id", unEnrollClass);
router.post("/feedback/:classID", feedbackClass);

module.exports = router;
