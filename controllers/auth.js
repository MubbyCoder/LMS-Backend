const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signJWt = require("./../utils/signJwt");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const AppError = require("../utils/error");
const { validateUserSignup } = require("../uservalidation/validations");
const {validateUserLogin} = require("../uservalidation/validations");

const signup = async (req, res, next) => {
  try {
    console.log(req.body);

    // Validate the incoming request
    const validation = validateUserSignup(req.body);
    if (validation?.error) {
      throw new AppError(validation?.error.message, 400);
    }

    const { firstname, lastname, email, password, role } = req.body;

    // Check if the user with the email already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      throw new AppError("User with the email address already exists", 400);
    }

    // Determine role and validate admin credentials if needed
    let finalRole = "user"; // Default role
    if (role === "admin") {
      if (password !== process.env.ADMIN_SIGNUP_PASSWORD) {
        throw new AppError("Invalid admin password", 401);
      }
      finalRole = "admin"; // Set role to admin if password matches
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10); // Ensure salt is properly defined here
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const user = await Users.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: finalRole, // Role is dynamically set
    });

    if (!user) {
      throw new AppError("Failed to create user account", 500);
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = await bcrypt.hash(verificationToken, salt);

    // Create verification URL
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/verify/${user.email}/${verificationToken}`;

    // Combined welcome and verification message
    const emailMessage = `
       Welcome to our platform, ${firstname} ${lastname}!

      We're excited to have you onboard. Please verify your email to complete your registration.

      Click the link below to verify your email:
      ${verificationUrl}

      If you did not create an account, please disregard this email. Thanks!
    `;
 
    // Send combined welcome and verification email
    await sendEmail({
      email: email,
      subject: "Welcome! Verify Your Email",
      message: emailMessage,
    });

    // Save the hashed verification token in the user's record
    user.verification_token = hashedVerificationToken;
    await user.save();

    // Create auth token
    const token = signJWt(user._id); // Passing user._id to signJwt

    res.status(201).json({
      status: "success",
      data: {
        user,
        token,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const validation = validateUserLogin(req.body);
    if (validation.error) {
      throw new AppError(validation.error.message, 400);
    }

    const { email, password } = req.body;

    // Find the user with the provided email and include the password field
    const user = await Users.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Compare provided password with the stored hashed password
    const isPasswordValid = await user.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate a JWT token
    const token = signJWt(user._id);

    // Remove the password from the user object before sending the response
    user.password = undefined;

    // Send the response
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error); 
  }
};

const verifyEmailAddress = async (req, res, next) => {
  try {
    const { email, verificationToken } = req.params;

    if (!email || !verificationToken) {
      throw new Error("Please provide both email and verification token.");
    }

    // Find the user by email
    const user = await Users.findOne({ email });
    if (!user) {
      throw new Error("User with the specified email not found.");
    }

    // Compare verification tokens
    const tokenValid = await bcrypt.compare(
      verificationToken,
      user.verification_token
    );

    if (!tokenValid) {
      throw new Error("Failed to verify user - Invalid verification token.");
    }

    // Update user as verified
    user.email_verified = true;
    user.verification_token = undefined; // Optional: Clear the verification token after verification
    await user.save();

    res.status(200).json({
      status: "success",
      message: "User verified successfully.",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};


//
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) throw new AppError("Please provide an email address", 400);

    const user = await Users.findOne({ email });
    if (!user) throw new AppError("No user found with that email address", 404);

    // Generate 4-digit verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Log the generated verification code
    console.log("Generated verification code:", verificationCode);

    // Create the email message
    const verificationMessage = `
      Hello ${user.firstname},
      
      Please use the following code to verify your identity and reset your password:
      ${verificationCode}

      This code will expire in 10 minutes. If you did not request a password reset, please ignore this email.
    `;

    // Send verification code email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Verification Code",
      message: verificationMessage,
    });

    // Save verification code and expiry time to the user record
    user.password_reset_verification_code = verificationCode;
    user.password_reset_code_expires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

    // Log before saving to verify data
    console.log("User data before saving (verification code and expiry):", {
      password_reset_verification_code: user.password_reset_verification_code,
      password_reset_code_expires: user.password_reset_code_expires,
    });

    // Save the updated user data
    await user.save();

    // Check if the data is saved in DB
    const updatedUser = await Users.findOne({ email });
    console.log("User data after saving:", updatedUser);

    res.status(200).json({
      status: "success",
      message: "Verification code sent to email. It will expire in 10 minutes.",
    });
  } catch (error) {
    console.log("Error in forgotPassword:", error);
    next(error);
  }
};


const verifyCode = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;

    console.log("Received email from request:", email);
    console.log("Received verification code from request:", verificationCode);

    if (!email || !verificationCode) {
      throw new AppError("Please provide both email and verification code", 400);
    }

    // Find user by email
    const user = await Users.findOne({ email });

    if (!user) {
      throw new AppError("No user found with that email address", 404);
    }

    // Log to see stored values
    console.log("Stored verification code:", user.password_reset_verification_code);
    console.log("Stored code expiration time:", user.password_reset_code_expires);
    console.log("Current server time:", Date.now());

    // Check if the verification code is valid and hasn't expired
    const isCodeValid = 
      user.password_reset_verification_code === verificationCode && 
      user.password_reset_code_expires > Date.now();

    console.log("Is the verification code valid?", isCodeValid);

    // If the code is invalid or expired
    if (!isCodeValid) {
      console.log("Code validation failed");
      throw new AppError("Invalid or expired verification code", 400);
    }

    // If the code is valid
    res.status(200).json({
      status: "success",
      message: "Verification code is valid. You can now reset your password.",
    });

  } catch (error) {
    console.error("Error during code verification:", error.message);
    res.status(error.statusCode || 500).json({
      status: "fail",
      message: error.message || "Server error",
    });
  }
};




const resetPassword = async (req, res, next) => {
  try {
    const { email, verificationCode, password, confirmPassword } = req.body;

    if (!email || !verificationCode || !password || !confirmPassword) {
      throw new AppError("Please provide all required fields", 400);
    }

    const user = await Users.findOne({ email });
    if (!user) throw new AppError("No user found with that email address", 404);

    // Verify code and expiry
    const isCodeValid =
      user.password_reset_verification_code === verificationCode &&
      user.password_reset_code_expires > Date.now();

    if (!isCodeValid) {
      throw new AppError("Invalid or expired verification code", 400);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password and clear the reset fields
    user.password = hashedPassword;
    user.password_reset_verification_code = undefined;
    user.password_reset_code_expires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password has been successfully reset.",
    });
  } catch (error) {
    next(error);
  }
};

 

module.exports = {
  signup,
  login,
  verifyEmailAddress,
  forgotPassword,
  verifyCode,
  resetPassword
};
