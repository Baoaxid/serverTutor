const express = require("express");
const PaymentController = require("../controllers/paymentController");

const router = express.Router();

router.post("/createPayment", PaymentController.createPayment);
router.post("/checkPayment/:id", PaymentController.checkPayment);
router.get("/getPaymentInfo", PaymentController.getPaymentInfo);

module.exports = router;
