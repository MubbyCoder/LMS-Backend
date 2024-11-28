const mongoose = require('mongoose');

const BorrowedBookSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Books',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  borrowDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  returnDate: {
    type: Date,
    required: true,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from borrow date
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed',
  },
  returnedLate: {
    type: Boolean,
    default: false,
  },
});


BorrowedBookSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model('BorrowedBook', BorrowedBookSchema);
