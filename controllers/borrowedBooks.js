const BorrowedBook = require("../models/BorrowedBooks");
const Books = require("../models/books");
const Users = require("../models/user"); 

const BORROW_BAN_DAYS = 3; 

const borrowBook = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const userId = req.user._id; 

    const user = await Users.findById(userId);

    
    if (user.banUntil && user.banUntil > new Date()) {
      const daysRemaining = Math.ceil((user.banUntil - new Date()) / (1000 * 60 * 60 * 24));
      return res.status(403).json({
        status: "fail",
        message: `You are temporarily banned from borrowing books. Try again in ${daysRemaining} day(s).`,
      });
    }

    const book = await Books.findById(id);

    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found.",
      });
    }

    if (!book.isAvailable) {
      return res.status(400).json({
        status: "fail",
        message: "This book is currently unavailable.",
      });
    }

    
    const borrowedBook = await BorrowedBook.create({
      book: id,
      user: userId,
      category: book.category,
    });

    
    book.isAvailable = false;
    await book.save();

    res.status(200).json({
      status: "success",
      message: "You have successfully borrowed this book.",
      data: { borrowedBook },
    });
  } catch (error) {
    next(error);
  }
};


const mongoose = require("mongoose");



const returnBorrowedbook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid book ID format." });
    }

    // Find the borrowed book
    const borrowedBook = await BorrowedBook.findOne({
      _id: id,
      user: userId,
      status: "borrowed",
    });

    if (!borrowedBook) {
      return res.status(404).json({
        status: "fail",
        message: "Borrowed book record not found for this user or is already returned.",
      });
    }

    // Update the status to returned
    borrowedBook.status = "returned";

    // Check if the return is late
    const isLate = new Date() > borrowedBook.returnDate;
    if (isLate) {
      borrowedBook.returnedLate = true;

      // Apply penalty to the user
      const user = await Users.findById(userId);
      if (user) {
        const BORROW_BAN_DAYS = 3; // Replace with your actual ban duration
        user.banUntil = new Date(Date.now() + BORROW_BAN_DAYS * 24 * 60 * 60 * 1000);
        await user.save();
      }
    }

    await borrowedBook.save();

    // Mark the book as available
    const book = await Books.findById(borrowedBook.book);
    if (book) {
      book.isAvailable = true;
      await book.save();
    }

    res.status(200).json({
      status: "success",
      message: `Book successfully returned.${isLate ? " Note: Late return penalty applied." : ""}`,
    });
  } catch (error) {
    console.error("Error in returnBorrowedbook:", error);
    next(error);
  }
};



const getBorrowedBooks = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized: User not logged in.",
      });
    }

    const borrowedBooks = await BorrowedBook.find({ user: userId }).populate("book");

    return res.status(200).json({
      status: "success",
      data: borrowedBooks || [],
      message: borrowedBooks.length
        ? "Borrowed books retrieved successfully."
        : "No borrowed books found.",
    });
  } catch (error) {
    console.error("Error in getBorrowedBooks", { error, userId: req.user?._id });
    next(error);
  }
};

const getAllBorrowedBooks = async (req, res, next) => {
  try {
    // Fetch all borrowed books, populating user and book details
    const borrowedBooks = await BorrowedBook.find()
      .populate("book", "title author") // Populating only specific fields from the book
      .populate("user", "name email"); // Populating specific fields from the user

    if (!borrowedBooks || borrowedBooks.length === 0) {
      return res.status(200).json({
        status: "success",
        data: [],
        message: "No borrowed books found.",
      });
    }

    res.status(200).json({
      status: "success",
      data: borrowedBooks,
    });
  } catch (error) {
    console.error("Error in getAllBorrowedBooks", error);
    next(error);
  }
};




const getOverdueBooks = async (req, res, next) => {
  try {
    const overdueBooks = await BorrowedBook.find({
      user: req.user._id,
      status: "borrowed",
      returnDate: { $lt: new Date() },
    }).populate("book", "title author");

    res.status(200).json({
      status: "success",
      data: overdueBooks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  borrowBook,
  returnBorrowedbook,
  getBorrowedBooks,
  getOverdueBooks,
  getAllBorrowedBooks,
};
