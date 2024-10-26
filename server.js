const mongoose = require ("mongoose");
const dotenv = require("dotenv").config();

if (dotenv.error) {
  throw new Error("Failed to load .env file");
}
// const mongo_password = process.env.MONGO_PASSWORD;
const mongo_url = process.env.MONGO_URL
console.log(mongo_url)
const connectDB = async () => {
  mongoose.connect(mongo_url)
    .then(() => {
      console.log("Database connected successfully!!");
    })
    .catch((error) => {
      console.log("An error occurred while connecting to the database", error);
    });
};

connectDB();

module.exports = connectDB;