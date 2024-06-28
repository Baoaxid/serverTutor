const express = require("express");
const {
  updateUser,
  banUsers,
  unbanUsers,
} = require("../controllers/adminController");

const router = express.Router();

router.put("/updateUsers/:id", updateUser);
router.put("/banUsers/:id", banUsers);
router.put("/unbanUsers/:id", unbanUsers);

module.exports = router;
