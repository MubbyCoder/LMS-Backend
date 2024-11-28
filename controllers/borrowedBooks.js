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

    console.log("ID:", id, "User ID:", userId);

    // Relaxed query for debugging
    const borrowedBook = await BorrowedBook.findOne({ _id: id, user: userId });

    if (!borrowedBook || borrowedBook.status !== "borrowed") {
      console.error("BorrowedBook not found with query:", { _id: id, user: userId, status: "borrowed" });
      return res.status(404).json({
        status: "fail",
        message: "No matching borrowed record found. Ensure the book is borrowed and belongs to this user.",
      });
    }

    borrowedBook.status = "returned";
    const isLate = new Date() > borrowedBook.returnDate;

    if (isLate) {
      borrowedBook.returnedLate = true;

      const user = await Users.findById(userId);
      user.banUntil = new Date(Date.now() + BORROW_BAN_DAYS * 24 * 60 * 60 * 1000);
      await user.save();
    }

    await borrowedBook.save();

    const book = await Books.findById(borrowedBook.book);
    if (book) {
      book.isAvailable = true;
      await book.save();
    }

    res.status(200).json({
      status: "success",
      message: `Book successfully returned.${isLate ? " Note: You are banned from borrowing for 3 days due to late return." : ""}`,
    });
  } catch (error) {
    console.error("Error in returnBorrowedbook:", error);
    next(error);
  }
};



const getBorrowedBooks = async (req, res, next) => {
  try {
    const userId = req.user._id; // Ensure `protectRoute` populates `req.user`
    const borrowedBooks = await BorrowedBook.find({ user: userId }).populate("book");

    if (!borrowedBooks || borrowedBooks.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No borrowed books found.",
      });
    }

    res.status(200).json({
      status: "success",
      data: borrowedBooks,
    });
  } catch (error) {
    console.log("Error in getBorrowedBooks", error);
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
};
