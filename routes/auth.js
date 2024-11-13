const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/verify/:email/:verificationToken")
  .get(authController.verifyEmailAddress);

router.route("/forgot-password").post(authController.forgotPassword);
router.route("/verifyCode").post(authController.verifyCode); 

router
  .route("/resetPassword/")
  .patch(authController.resetPassword);

module.exports = router;
  