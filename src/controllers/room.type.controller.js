const RoomType = require("../models/room.type.model");

exports.create = (req, res) => {
  RoomType.create({ ...req.body })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.findAll = (req, res) => {
  RoomType.findAll()
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  RoomType.findOne({ where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  RoomType.update({ ...req.body }, { where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  RoomType.destroy({ where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};
