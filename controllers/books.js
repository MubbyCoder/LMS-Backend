const AppError = require("../utils/error");  // Import AppError only once
const Books = require("./../models/books");  // Import Books only once
const { dataUri } = require("./../utils/multer");
const cloudinary = require("./../utils/cloudinary"); // Import `cloudinary` directly

// Get all books (public)
const getAllBooks = async (req, res, next) => {
  try {
    const books = await Books.find().populate("user");
    res.status(200).json({
      status: "success",
      message: "All books fetched successfully",
      result: books.length,
      data: { books },
    });
  } catch (error) {
    console.error("Error in getAllBooks:", error);
    next(error);
  }
};

// Create a new book (admin)
const createNewBook = async (req, res, next) => {
  try {
    // Check if the image is provided
    if (!req.file) {
      throw new AppError("Please provide a book image", 400);
    }

    // Log the received file data for debugging
    const fileData = dataUri(req).content;
    console.log("File Data to upload:", fileData);

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(fileData, { folder: "LMS/Books" });

    // Log Cloudinary upload result for debugging
    console.log("Cloudinary upload result:", result);

    // Check for missing fields in the request body
    const { title, author, description, copy, NumberOfPages, isAvailable, category } = req.body;
    if (!title || !author || !description || !copy || !NumberOfPages || !category) {
      throw new AppError("Missing required fields", 400);
    }

    // Create the new book in the database (admin)
    const newBook = await Books.create({
      title,
      author,
      description,
      user: req.user._id, 
      image: result.secure_url, // Use Cloudinary URL for the image
      copy,
      category,
      NumberOfPages,
      isAvailable,
    });

    // Send a successful response
    res.status(201).json({
      status: "success",
      message: "Book created successfully",
      data: { book: newBook },
    });
  } catch (error) {
    console.error("Error in createNewBook:", error); // Log the error details
    next(error); // Pass the error to the global error handler
  }
};


// Search for books by title (public)
const searchBooksByTitle = async (req, res, next) => {
  try {
    const { title } = req.query; // Extract the title from query parameters

    if (!title) {
      throw new AppError("Title parameter is required for search", 400);
    }

    const books = await Books.find({ title: new RegExp(title, "i") }); // Case-insensitive search

    if (!books.length) {
      throw new AppError("No books found with the specified title", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Books fetched successfully",
      data: { books },
    });
  } catch (error) {
    console.error("Error in searchBooksByTitle:", error);
    next(error);
  }
};


// Update book details (admin)
const updateBookDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateDetails = req.body;

    const updatedBook = await Books.findByIdAndUpdate(id, updateDetails, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      throw new AppError("Book with the specified ID not found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Book updated successfully",
      data: { book: updatedBook },
    });
  } catch (error) {
    // console.error("Error in updateBookDetails:", error);
    next(error);
  }
};

// Delete book (admin)
const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBook = await Books.findByIdAndDelete(id);

    if (!deletedBook) {
      throw new AppError("Book with the specified ID not found", 404);
    }

    res.status(204).json({
      status: "success",
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error in deleteBook:", error);
    next(error);
  }
};

// Get all books for admin
const getAllBooksByAdmin = async (req, res, next) => {
  try {
    const books = await Books.find().populate("user");
    res.status(200).json({
      status: "success",
      message: "All books fetched successfully",
      result: books.length,
      data: { books },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBooks,
  createNewBook,
  searchBooksByTitle,
  updateBookDetails,
  deleteBook,
  getAllBooksByAdmin,
};
