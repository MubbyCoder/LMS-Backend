const BorrowedBook = require('../models/BorrowedBooks');
const { findById } = require('../models/books');

async function borrowBook(req, res) {
  try {
    const book = await findById(req.params.bookId).populate('category');
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    const existingBorrowedBook = await BorrowedBook.findOne({
      book: req.params.bookId,
      user: req.user._id,
    });

    if (existingBorrowedBook) {
      return res.status(400).json({ success: false, message: 'You have already borrowed this book' });
    }

    const borrowedBook = new BorrowedBook({
      book: req.params.bookId,
      user: req.user._id,
      category: book.category._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await borrowedBook.save();
    res.status(201).json({ success: true, data: borrowedBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to borrow book: ' + err.message });
  }
}

async function getBorrowedBooks(req, res) {
  try {
    const borrowedBooks = await BorrowedBook.find({ user: req.user._id })
      .populate('book')
      .populate('category');
    res.json({ success: true, data: borrowedBooks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to retrieve borrowed books: ' + err.message });
  }
}

module.exports = { borrowBook, getBorrowedBooks };
