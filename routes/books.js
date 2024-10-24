// routes/books.js

const express = require('express');
const {
  getAllBooks,
  createNewBook,
  getBookDetails,
  updateBookDetails,
  deleteBook,
  getAllBooksByAdmin
} = require('../controllers/books');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

const router = express.Router();

// Public routes
router.route('/').get(getAllBooks);
router.route('/:id').get(getBookDetails);

// Admin routes
// router.use(auth); 
router.route('/admin').get(getAllBooksByAdmin);
router.route('/').post(createNewBook);
router.route('/:id').put(updateBookDetails).delete(deleteBook);

module.exports = router;