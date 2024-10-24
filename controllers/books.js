const AppError = require("../utils/error");
// const books = require("./../data/books");
const books = require("./../models/books");
const { dataUri } = require("./../utils/multer");
const { uploader } = require("./../utils/cloudinary");
const getAllBooks = async (req, res) => {
  try {
    const Books = await Books.find().populate("user");
    res.status(200).json({
      status: "success",
      message: "All books fetched successfully",
      result: books.length,
      data: {
        books,
      },
    });
  } catch (error) {}
};

const createNewBook = async (req, res, next) => {
  try {
    console.log(req.file);
    if(!req.file){
      throw new AppError("Please provide a book image", 400);
    }
    const fileData = dataUri(req).content;
    const result = await uploader.upload(fileData, {
      folder: "LMS/Book",
    });
    console.log(result);
    // console.log(fileData);
    const userId = req.user._id;
    const { title, author, description } = req.body;
    // if (!title || !price || !description) {
    //   throw new AppError("Please provide all required fields", 400);
    // }
    const newBook = await Books.create({
      title,
      author,
      description,
      user: userId,
      image: result.secure_url,
    });
    if (!newBook) {
      throw new AppError("An error occurred while creating the book", 404);
    }
    res.status(201).json({
      status: "success",
      message: "Book created successfully",
      data: {
        product: newBook,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBookDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Heyyyyyyyyyyyyyyyyy");
    const product = await books.findById(id);
    if (!product) {
      throw new AppError("Book with the specified ID not found", 401);
    }
    res.status(200).json({
      status: "success",
      message: "Book fetched successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateBookDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateDetails = req.body;

    // console.log("Updated details", updateDetails);

    if (!id) {
      throw new Error("Please provide the product id");
    }
    const updatedBook = await Books.findByIdAndUpdate(id, updateDetails, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      message: "Book updated successfully",
      data: {
        book: updatedBook,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "An error occurred with message: " + error.message,
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await Products.findByIdAndDelete(id);
    res.status(204).json({
      status: "success",
      message: "Product deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "An error occurred with message: " + error.message,
    });
  }
};

const getAllBooksByAdmin = async (req, res) => {
  try {
    const books = await Books.find().populate("user");
    res.status(200).json({
      status: "success",
      message: "All books fetched successfully",
      result: books.length,
      data: {
        books,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "An error occurred with message: " + error.message,
    });
  }
};

module.exports = {
  getAllBooks,
  createNewBook,
  getBookDetails,
  updateBookDetails,
  deleteBook,
  getAllBooksByAdmin,
};
