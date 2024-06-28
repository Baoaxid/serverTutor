const express = require("express");
const {
  getTutor,
  enrollClass,
  unEnrollClass,
  findClassByTutorNameController,
} = require("../controllers/studentController");

const router = express.Router();

router.get("/getTutor", getTutor);
router.get("/searchClassByTutorName/:search", findClassByTutorNameController);
router.post("/enrollClass/:id", enrollClass);
router.post("/unEnrollClass/:id", unEnrollClass);

module.exports = router;
