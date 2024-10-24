const mongoose = require('mongoose');
const BorrowedBookSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    borrowDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    category: {
        type: String,
        required: true
    },
    returnDate: {
        type: Date,
        required: true,
        default: () => Date.now() + 7 * 24 * 60 * 60 * 1000
    }, // 7 days from borrow date
});

module.exports = mongoose.model('BorrowedBook', BorrowedBookSchema);