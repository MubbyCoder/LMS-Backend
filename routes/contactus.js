const express = require("express");
const { sendContactMessage } = require("../controllers/contactus");

const router = express.Router();

// POST route for contact form
router.post("/contactus", sendContactMessage);

module.exports = router;
