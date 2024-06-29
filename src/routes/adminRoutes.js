const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.put("/updateUsers/:id", adminController.updateUser);
router.put("/banUsers/:id", adminController.banUsers);
router.put("/unbanUsers/:id", adminController.unbanUsers);
router.get("/complainList", adminController.getComplainList);

module.exports = router;
