const express = require("express");
const multer = require("multer");
const { imageUploads } = require("../utils/multer");
const { protectRoute, verifyIsAdmin } = require("../middleware/auth");
const {
  getAllBooks,
  createNewBook,
  searchBooksByTitle,
  updateBookDetails,
  deleteBook,
  getAllBooksByAdmin,
} = require("../controllers/books");

const router = express.Router();

// Public routes
router.route("/").get(getAllBooks);
router.route("/search").get(searchBooksByTitle);

// Admin-only routes
router.route("/admin").get(protectRoute, verifyIsAdmin, getAllBooksByAdmin);
router.route("/")
  .post(protectRoute, verifyIsAdmin, imageUploads, createNewBook); // Restrict create to admins
router.route("/:id")
  .patch(protectRoute, verifyIsAdmin, updateBookDetails) // Restrict update to admins
  .delete(protectRoute, verifyIsAdmin, deleteBook); // Restrict delete to admins

module.exports = router;
