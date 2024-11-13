const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please add a firstname'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'Please add a lastname'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    currently_reading_a_book: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    verification_token: {
        type: String,
    },
    reset_password_token: {
        type: String,
    },
    // New fields for password reset verification code and expiry
    password_reset_verification_code: {
        type: String,
          // Don't include this in standard query results for security
    },
    password_reset_code_expires: {
        type: Date,
        // select: false,  // Don't include this in standard query results for security
    }
});

UserSchema.methods.getFullName = function () { return `${this.firstname} ${this.lastname}`; };

UserSchema.methods.comparePassword = async function (password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
};

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
