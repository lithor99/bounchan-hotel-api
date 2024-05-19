const Otps = require("../models/otp.model");
const { sendMail } = require("../functions/send.mail");
require("dotenv").config();

//forgot password
exports.create = async (req, res) => {
  const { email } = req.body;
  let otp;

  async function RandomOtp() {
    otp = Math.floor(Math.random().toFixed(6) * 1000000).toString();
    if (otp.length != 6) {
      RandomOtp();
    }
  }

  await RandomOtp();
  const date = new Date();
  const expiredDate = new Date(date.setTime(date.getTime() + 2 * 60 * 1000));

  Otps.create({ email: email, otp: otp, expiredDate: expiredDate })
    .then(async (data) => {
      if (data) {
        await sendMail(`${email}`, `OTP`, `Your OTP code is ${otp}`);
        return res.status(200).send({ message: "OTP sent successfully" });
      } else {
        return res.status(400).json({ message: "Some thing when wrong" });
      }
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};

//confirm otp
exports.confirm = (req, res) => {
  const { email, otp } = req.body;
  const date = new Date();
  const where = { email: email };
  Otps.findOne({ limit: 1, where: where, order: [["createdAt", "DESC"]] })
    .then(async (data) => {
      if (data) {
        if (otp === data.otp) {
          if (date < data.expiredDate) {
            return res.status(200).json({ message: "success" });
          }
          return res.status(202).json({ message: "OTP has expired" });
        } else {
          return res.status(202).json({ message: "OTP is invalid" });
        }
      }
      return res.status(400).json({ message: "Some thing when wrong" });
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};
