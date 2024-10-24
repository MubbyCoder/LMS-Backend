const Book = require('../models/books');
const User = require('../models/user'); 
const Reservation = require('../models/reservation'); 
const AppError = require('../utils/error');

// Reserve a book
const reserveBook = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    // Check if the book is available
    const book = await Book.findById(bookId);
    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    // Check if the user has already reserved the book
    const existingReservation = await Reservation.findOne({ book: bookId, user: userId });
    if (existingReservation) {
      return next(new AppError('You have already reserved this book', 400));
    }

    // Create a new reservation
    const reservation = await Reservation.create({ book: bookId, user: userId });

    res.status(201).json({
      status: 'success',
      data: {
        reservation,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all reservations
const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find().populate('book').populate('user');
    res.status(200).json({
      status: 'success',
      results: reservations.length,
      data: {
        reservations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific reservation
const getReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id).populate('book').populate('user');
    if (!reservation) {
      return next(new AppError('Reservation not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        reservation,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update a reservation
const updateReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const reservation = await Reservation.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!reservation) {
      return next(new AppError('Reservation not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        reservation,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a reservation
const deleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) {
      return next(new AppError('Reservation not found', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  reserveBook,
  getAllReservations,
  getReservation,
  updateReservation,
  deleteReservation,
};