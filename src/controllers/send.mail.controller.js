const { sendMail } = require("../functions/send.mail");

exports.sendEmail = async (req, res) => {
  const { email, title, description } = req.body;
  await sendMail(email, title, description);
  return res
    .status(200)
    .send({ result: { email: email, title: title, description: description } });
};
