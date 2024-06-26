const express = require("express");
const {
  createClasses,
  updateClasses,
  deleteClasses,
} = require("../controllers/classController");

const router = express.Router();

router.post("/createClasses", createClasses);
router.post("/updateClasses/:id", updateClasses); //need auth for update
router.delete("/deleteClasses/:id", deleteClasses);

module.exports = router;