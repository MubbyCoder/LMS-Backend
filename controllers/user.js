// const users = require("./../data/user");
const { genSalt, hash } = require("bcryptjs");
const { find, findById } =require ("../models/user");
const AppError = require  ("../utils/error");
const { dataUri } = require ("../utils/multer");
const { uploader } =require  ("../utils/cloudinary");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await find();

    // if (!users) {
    //   throw new AppError("No users found", 404);
    // }

    res.status(200).json({
      status: "success",
      message: "All users fetched successfully",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

//
const getUserProfile = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await findById(userId);
    if (!user) {
      throw new AppError(`User not found with id of ${id}`, 404);
    }
    const fullname = user.getFullName();

    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      data: {
        user,
        fullname,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await findById(userId);
    if (!user) {
      throw new AppError(`User not found with id of ${id}`, 404);
    }
    const file = req.file;
    const imageData = dataUri(req).content;
    const result = await uploader.upload(imageData, {
      folder: "LMS/profile_images",
    });
    user.profile_image = result.secure_url;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile picture updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await findById(userId);
    if (!user) {
      throw new AppError(`User not found with id of ${id}`, 404);
    }
    const allowedFields = ["firstname", "lastname", "bio"];
    const fieldsToUpdate = Object.keys(req.body);
    fieldsToUpdate.forEach((field) => {
      if (allowedFields.includes(field)) {
        user[field] = req.body[field];
      } else {
        throw new AppError(
          `Field ${field} is not allowed to be updated using this route`,
          400
        );
      }
    });
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await findById(userId).select("+password");
    if (!user) {
      throw new AppError(`User not found with id of ${id}`, 404);
    }
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      throw new AppError(
        "Please provide both old and new and confirm password",
        400
      );
    }
    const isPasswordValid = await user.comparePassword(
      oldPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError("Old password is incorrect", 400);
    }

    if (oldPassword === newPassword) {
      throw new AppError(
        "New password cannot be the same as old password",
        400
      );
    }

    if (newPassword !== confirmNewPassword) {
      throw new AppError(
        "New password and confirm new password do not match",
        400
      );
    }
    const salt = await genSalt(12);
    const hashedPassword = await hash(newPassword, salt);

    user.password = hashedPassword;
    console.log();
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateProfilePicture,
  updateProfile,
  updatePassword,
};
