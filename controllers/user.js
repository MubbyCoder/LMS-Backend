const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/error");

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find();
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

// Get logged-in user's profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update logged-in user's profile
exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update profile picture
exports.updateProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("Please provide a profile picture", 400);
    }
    const user = await Users.findByIdAndUpdate(
      req.user._id,
      { profilePicture: req.file.path }, // Assuming `profilePicture` field in the schema
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError("Please provide current and new password", 400);
    }

    const user = await Users.findById(req.user._id).select("+password");

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      throw new AppError("Current password is incorrect", 401);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
