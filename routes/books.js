const express = require('express');
const multer = require('multer');
const {imageUploads} = require('../utils/multer');
const {protectRoute} = require('../middleware/auth');
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

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage }); // Define `upload` using `multer`

// Public routes
router.route('/').get(getAllBooks);
router.route('/:id').get(getBookDetails);

// Admin routes
// router.use(auth);
router.route('/admin').get(getAllBooksByAdmin);
router.route('/').post(protectRoute,imageUploads, createNewBook); // Use `upload` for image upload
router.route('/:id').put(updateBookDetails).delete(deleteBook);

module.exports = router;
