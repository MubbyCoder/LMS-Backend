const Users = require("../models/user");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/error");

const protectRoute = async (req, res, next) => {
  try {
    let token;
    // Get token from authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      throw new AppError("You are not logged in, please login", 401);
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new AppError("Invalid token, please login again", 401);
    }

    // Check if user exists using the decoded ID
    const user = await Users.findById(decoded.userId); // assuming userId is in payload
    if (!user) {
      throw new AppError("User with the specified ID not found", 404);
    }

    req.user = user; // Attach the user object to the request
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    next(error); // Pass errors to error handler
  }
};

const verifyIsAdmin = async (req, res, next) => {
  try {
    // Check if the logged-in user is an admin
    if (req.user.role !== "admin") {
      throw new AppError(
        "You are not authorized to access this route, this route belongs to admin users",
        403
      );
    }
    next(); // Proceed to next middleware or route handler if admin
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 401).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = { protectRoute, verifyIsAdmin };
