const express = require("express");
const {
    createReview,
    getReviews,
    getAllReviews,
    deleteReview,
  } = require("../controllers/reviews");
  const { protectRoute, verifyIsAdmin } = require("../middleware/auth");
  
  const router = express.Router();
  
  // Add a review to a book
  router.post("/:bookId", protectRoute, createReview);
  
  // Get review for a book
  // router.get("/:bookId", getReviews);

   // Get all reviews for a book
  router.get("/all", getAllReviews)

  // Delete a review
  router.delete("/:id", protectRoute, verifyIsAdmin, deleteReview);
  
  module.exports = router;
  