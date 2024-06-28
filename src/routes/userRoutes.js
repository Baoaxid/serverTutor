const express = require("express");
const { updateUserForUser } = require("../controllers/userController");
const { getClass } = require("../controllers/classController");

const router = express.Router();

router.put("/update/:id", updateUserForUser);
router.get("/getClass/:id?", getClass);

module.exports = router;
