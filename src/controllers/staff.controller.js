const Staff = require("../models/staff.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.create = async (req, res) => {
  Staff.create({ ...req.body })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.login = (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  Staff.findOne({ where: { phoneNumber: phoneNumber, password: password } })
    .then((data) => {
      if (data) {
        const payload = {
          id: data.id,
          name: data.name,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          deviceToken: data.deviceToken,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: "120d",
        });
        return res.status(200).json({ result: { data: data, token: token } });
      }
      return res.status(403).json({ result: "Login failed" });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.findAll = (req, res) => {
  Staff.findAndCountAll()
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Staff.findOne({ where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  Staff.update({ ...req.body }, { where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.updatePassword = (req, res) => {
  const id = req.params.id;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  Staff.findOne({ where: { id: id } })
    .then((data) => {
      if (data.password === oldPassword) {
        Staff.update({ password: newPassword }, { where: { id: id } })
          .then((data) => {
            return res.status(200).json({ result: data });
          })
          .catch((error) => {
            return res.status(400).json({ result: error });
          });
      }
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.resetPassword = (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const newPassword = req.body.newPassword;
  Staff.update(
    { password: newPassword },
    { where: { phoneNumber: phoneNumber } }
  )
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Staff.destroy({ where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};