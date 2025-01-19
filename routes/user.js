const express = require("express");
const { getAllUsers, deleteUser, editUserProfile } = require("../controllers/user");
const { protectRoute } = require("../middleware/auth");
const { verifyIsAdmin } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Admin-only routes
router.get("/", verifyIsAdmin, getAllUsers); // Only admins can access
router.delete("/:id", verifyIsAdmin, deleteUser); // Admin can delete a user
router.patch("/:id", verifyIsAdmin, editUserProfile); // Admin can edit any user's profile

module.exports = router;
