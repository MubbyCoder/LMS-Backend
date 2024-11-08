const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const email = process.env.EMAIL;
  const password = process.env.EMAIL_PASSWORD;
  // Creating email transport
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: email, pass: password,},
    tls:true,
  });

  // configure email options
  const mailOptions = {
    from: "<kazephyrr@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //   Send the mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
