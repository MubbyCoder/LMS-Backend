const Review = require("../models/reviews");
const Book = require("../models/books");
const User = require("../models/user");

// Create a review
async function createReview(req, res) {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const review = new Review({
      book: req.params.bookId,
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await review.save();
    res.status(201).json({
      status: "success",
      data: review,
      message: "Review added successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get review for a book
// async function getReviews(req, res) {
//   try {
//     const reviews = await Review.find({ book: req.params.bookId })
//       .populate("user", "name email")
//       .populate("book", "title");

//     if (!reviews || reviews.length === 0) {
//       return res.status(200).json({
//         status: "success",
//         data: [],
//         message: "No reviews found for this book.",
//       });
//     }

//     res.status(200).json({ status: "success", data: reviews });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

async function getAllReviews(req, res) {
    try {
      const reviews = await Review.find()
        .populate("user", "firstname lastname email")  // Populate with full name and email of the user
        .populate("book", "title author"); // Populate the book's title and author (adjust as needed)
  
      if (!reviews || reviews.length === 0) {
        return res.status(200).json({
          status: "success",
          data: [],
          message: "No reviews found.",
        });
      }
  
      res.status(200).json({
        status: "success",
        data: reviews,
        message: "All reviews fetched successfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  
  

// Delete a review
async function deleteReview(req, res) {
    try {
      // Find the review by ID
      const review = await Review.findById(req.params.id);
      
      // Check if the review exists
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      // Ensure that the user is an admin
      if (req.user.role !== "admin") {
        return res.status(403).json({
          message: "Unauthorized action. Only admins can delete reviews.",
        });
      }
  
      // Delete the review from the database
      await Review.deleteOne({ _id: req.params.id });
  
      // Send a success response
      res.status(200).json({
        status: "success",
        message: "Review deleted successfully",
      });
    } catch (err) {
      // Catch any errors and send a failure response
      res.status(500).json({ message: err.message });
    }
  }
  
  

module.exports = { createReview, getAllReviews, deleteReview };
