const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/error");

// Helper function to ensure only admins can perform certain actions
// const ensureAdmin = (req) => {
//   if (req.user.role !== "admin") {
//     throw new AppError("You do not have permission to perform this action", 403);
//   }
// };

// Admin: Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return next(new AppError("Access denied. Admins only.", 403));
    }

    // Fetch all users except those with role "admin"
    const users = await Users.find({ role: { $ne: "admin" } });

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};



// Admin: Delete a user
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new AppError("Access denied. Admins only.", 403));
    }
    const { id } = req.params;
    const user = await Users.findByIdAndDelete(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Edit any user's profile (Admin only)
exports.editUserProfile = async (req, res, next) => {
  try {
    ensureAdmin(req);

    const { id } = req.params;
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};
