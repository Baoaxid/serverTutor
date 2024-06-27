const express = require("express");
const { getTutor } = require("../controllers/studentController");

const router = express.Router();

router.get("/getTutor", getTutor);

module.exports = router;
