const express = require ("express");
const {json, urlencoded} = require("express");
const morgan = require ("morgan");
const cors= require ("cors");
const dotenv = require("dotenv").config();
const server = require ("./server.js");
const BorrowedBooksRoutes = require ("./routes/BorrowedBooks.js");
const reviewsRoutes = require ("./routes/reviews.js");
const userRoutes = require ("./routes/user.js");
const authRoutes = require ("./routes/auth.js");
const BookRoutes = require ("./routes/books.js");
const reservationRoutes = require ("./routes/reservation.js");
const errorHandler = require ("./middleware/error.js");
const { cloudinaryConfig, uploader } = require ("./utils/cloudinary.js");

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors("*"));
// app.use("*", cloudinaryConfig);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to LMS",
  });
});

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to LMS API",
  });
});



app.use("/api/v1/BorrowedBooks", BorrowedBooksRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reviews", reviewsRoutes);
app.use("/api/v1/books", BookRoutes);
app.use("/api/v1/reservation", reservationRoutes);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} with method ${req.method} on this server. Route not defined`,
  });
});

// Calling our error handler
app.use(errorHandler)

console.log(process.env.PORT)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
// export { cloudinaryConfig, uploader };