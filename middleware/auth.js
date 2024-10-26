const Users = require("../models/user");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/error");

const protectRoute = async (req, res, next) => {
  try {
    let token;
    // Get token from authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      console.log(req.headers.authorization);
      token = req.headers.authorization.split(" ")[1];
    }

    console.log(token);

    // Check if token exists
    if (!token) {
      throw new AppError("You are not logged in, please login", 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.jwtSecret);
    console.log(decoded);

    // Check if user exists
    const user = await Users.findById(decoded.id);

    if (!user) {
      throw new AppError("User with the specified ID not found", 404);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const verifyIsAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new Error(
        "You are not authorized to access this route, this route belongs to admin users"
      );
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = { protectRoute, verifyIsAdmin };
