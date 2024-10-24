const express = require("express");
const { borrowBook, getBorrowedBooks } = require("../controllers/borrowedBooks");
const { protectRoute } = require("../middleware/auth");

const router = express.Router();

// Borrow a book
router.post("/borrow/:bookId", protectRoute, borrowBook);

// Get borrowed books for a user
router.get("/", protectRoute, getBorrowedBooks);

module.exports =router;
