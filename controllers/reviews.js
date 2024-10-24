const Review = require('../models/reviews');
const { findById: _findById } = require('../models/books');

async function createReview(req, res) {
  try {
    const book = await _findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const review = new Review({
      book: req.params.bookId,
      user: req.user,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getReviews(req, res) {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate('user');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteReview(req, res) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    await review.remove();
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createReview, getReviews, deleteReview };
