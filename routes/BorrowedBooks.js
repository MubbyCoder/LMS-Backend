const express = require("express");
const {
  borrowBook,
  returnBorrowedbook,
  getBorrowedBooks,
  getOverdueBooks,
  getAllBorrowedBooks,
} = require("../controllers/borrowedBooks");
const {  protectRoute, verifyIsAdmin } = require("../middleware/auth"); 

const router = express.Router();


router.route("/borrow/:id").post(protectRoute, borrowBook);


router.route("/return/:id").post(protectRoute, returnBorrowedbook);


router.route("/borrowed").get(protectRoute, getBorrowedBooks);

router.route("/borrowed/all").get (protectRoute, verifyIsAdmin, getAllBorrowedBooks);

router.route("/overdue").get(protectRoute, getOverdueBooks);

module.exports = router;
