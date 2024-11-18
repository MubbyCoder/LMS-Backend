const express = require("express");
const userController = require("../controllers/user");
const authMiddleware = require("./../middleware/auth");
const { imageUploads } = require("./../utils/multer");

const router = express.Router();

// Route to get all users
router.route("/").get(userController.getAllUsers);

// Route to get and update user profile
router
  .route("/profile")
  .get(authMiddleware.protectRoute, userController.getUserProfile) // Ensure getUserProfile is defined
  .patch(authMiddleware.protectRoute, userController.updateProfile); // Ensure updateProfile is defined

// Route to update profile picture
router
  .route("/update-profile-picture")
  .patch(
    authMiddleware.protectRoute,
    imageUploads, // Middleware for image upload
    userController.updateProfilePicture // Ensure updateProfilePicture is defined
  );

// Route to update password
router
  .route("/update-password")
  .patch(authMiddleware.protectRoute, userController.updatePassword); // Ensure updatePassword is defined

module.exports = router;
