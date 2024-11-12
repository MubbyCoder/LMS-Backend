const jwt = require("jsonwebtoken");

const signJwt = (userId, additionalData = {}) => {
  if (!userId) {
    throw new Error("User ID is required to generate a JWT");
  }

  const payload = { userId, ...additionalData }; // You can add more info like user role, etc.
  const secret = process.env.JWT_SECRET; // Make sure this is in your .env
  const expiresIn = process.env.JWT_EXPIRATION || "1h"; // You can adjust expiration time via env or fallback to "1h"

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  try {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (error) {
    throw new Error("Error while generating JWT: " + error.message);
  }
};

module.exports = signJwt;
