const RoomImage = require("../models/room.image.model");

exports.create = (req, res) => {
  RoomImage.create({ ...req.body })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.findAll = (req, res) => {
  RoomImage.findAll()
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  RoomImage.findOne({ where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  RoomImage.update({ ...req.body }, { where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  RoomImage.destroy({ where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};
