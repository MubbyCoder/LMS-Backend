const nodemailer = require("nodemailer");


exports.sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Set up email transporter (use your email credentials)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD, 
      },
    });

    // Compose email message
    const mailOptions = {
      from: email,
      to: process.env.EMAIL, // Your email address
      subject: `Contact Form Submission from ${name}`,
      text: `
        You have a new contact form submission:
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message. Please try again." });
  }
};
