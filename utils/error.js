// utils/error.js

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.isOperational = true; // set this to true to distinguish between operational and programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
