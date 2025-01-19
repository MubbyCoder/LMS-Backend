const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Books", // Reference to the Book model
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", // Reference to the User model
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // To automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model("Review", reviewSchema);
