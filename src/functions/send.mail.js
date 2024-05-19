require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendMail(email, title, body) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL,
    to: `${email}`,
    subject: `${title}`,
    text: `${body}`,
  };

  await transporter.verify();

  transporter.sendMail(mailOptions, (error, _info) => {
    // console.log(`Message sent: ${_info.messageId}`);
    if (error) {
      console.error("Error sending email: ", error);
      //   return res.status(500).send({ message: "Failed to send OTP" });
    } else {
      console.log("mail sent: ", body);
      //   return res.status(200).send({ message: "OTP sent successfully" });
    }
  });
}

module.exports = { sendMail };
