const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middlewares/auth");

router.post(
  "/stripe-create",
  auth,
  paymentController.createStripePaymentIntent
);
router.post("/stripe-confirm", auth, paymentController.confirmStripeTopup);
router.get("/balance", auth, paymentController.getWalletBalance);
router.post("/donate-recipe", auth, paymentController.donateToAuthor);
router.post("/donate-blog-author", auth, paymentController.donateToBlogAuthor);

// Withdrawal routes
router.post("/withdraw", auth, paymentController.requestWithdrawal);
router.get("/withdrawals", auth, paymentController.getWithdrawalRequests); // Assuming admin check in controller
router.put(
  "/withdrawals/:id/status",
  auth,
  paymentController.updateWithdrawalStatus
); // Assuming admin check in controller

// Stripe webhook route
// IMPORTANT: This route should NOT have auth middleware as it's called by Stripe
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhook
);

module.exports = router;
