const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendWelcomeEmail = (email, name) => {
  transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Getting started",
    html: `<h1>Congrats ${name} 🤗 </h1>`,
  });
};

const sendCancelEmail = (email, name) => {
  transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Sorrowed of losing a USER",
    html: `<h1>Goodbye ${name} 😟, Tell us why you didn't like our application</h1>`,
  });
};
module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
};
