const express = require("express");
const {
  borrowBook,
  returnBorrowedbook,
  getBorrowedBooks,
  getOverdueBooks,
} = require("../controllers/borrowedBooks");
const { protect, protectRoute } = require("../middleware/auth"); 

const router = express.Router();


router.route("/:id/borrow").post(protectRoute, borrowBook);


router.route("/:id/return").post(protectRoute, returnBorrowedbook);


router.route("/borrowed").get(protectRoute, getBorrowedBooks);


router.route("/overdue").get(protectRoute, getOverdueBooks);

module.exports = router;
