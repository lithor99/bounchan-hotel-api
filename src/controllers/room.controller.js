const Room = require("../models/room.model");
const RoomType = require("../models/room.type.model");
const RoomImage = require("../models/room.image.model");
const { Op } = require("sequelize");

exports.create = (req, res) => {
  const { images } = req.body;
  Room.create({ ...req.body })
    .then(async (data) => {
      for (let i = 0; i < images.length; i++) {
        await RoomImage.create({ roomId: data.id, image: images[i] });
      }
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.findAll = (req, res) => {
  const { search } = req.query;
  RoomType.hasMany(Room, { foreignKey: "roomTypeId" });
  Room.belongsTo(RoomType, { foreignKey: "roomTypeId" });
  Room.hasMany(RoomImage, { foreignKey: "roomId" });
  RoomImage.belongsTo(Room, { foreignKey: "roomId" });
  if (search != null && search != "") {
    Room.findAll({
      include: [RoomType, RoomImage],
      order: [["roomNo", "ASC"]],
      where: {
        [Op.or]: [{ roomNo: { [Op.like]: `%${search}%` } }],
      },
    })
      .then((data) => {
        return res.status(200).json({ result: data });
      })
      .catch((error) => {
        return res.status(400).json({ result: error });
      });
  } else {
    Room.findAll({
      include: [RoomType, RoomImage],
      order: [["roomNo", "ASC"]],
    })
      .then((data) => {
        return res.status(200).json({ result: data });
      })
      .catch((error) => {
        return res.status(400).json({ result: error });
      });
  }
};

exports.findRoomMember = (req, res) => {
  const { search } = req.query;
  RoomType.findAll()
    .then(async (data) => {
      if (data.length > 0) {
        if (search != null && search != "") {
          var rooms = [];
          for (let i = 0; i < data.length; i++) {
            RoomType.hasMany(Room, { foreignKey: "roomTypeId" });
            Room.belongsTo(RoomType, { foreignKey: "roomTypeId" });
            Room.hasMany(RoomImage, { foreignKey: "roomId" });
            RoomImage.belongsTo(Room, { foreignKey: "roomId" });
            var room = await Room.findAll({
              include: [RoomType, RoomImage],
              order: [["roomNo", "ASC"]],
              where: {
                roomTypeId: data[i].id,
                [Op.or]: [
                  { price: { [Op.like]: `%${search}%` } },
                  { description: { [Op.like]: `%${search}%` } },
                ],
              },
            });
            rooms.push({ roomType: data[i], rooms: room });
          }
          return res.status(200).json({ result: rooms });
        } else {
          var rooms = [];
          for (let i = 0; i < data.length; i++) {
            RoomType.hasMany(Room, { foreignKey: "roomTypeId" });
            Room.belongsTo(RoomType, { foreignKey: "roomTypeId" });
            Room.hasMany(RoomImage, { foreignKey: "roomId" });
            RoomImage.belongsTo(Room, { foreignKey: "roomId" });
            var room = await Room.findAll({
              include: [RoomType, RoomImage],
              order: [["roomNo", "ASC"]],
              where: {
                roomTypeId: data[i].id,
              },
            });
            rooms.push({ roomType: data[i], rooms: room });
          }
          return res.status(200).json({ result: rooms });
        }
      } else {
        return res.status(200).json({ result: data });
      }
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.findByRoomType = (req, res) => {
  const id = req.params.id;
  RoomType.hasMany(Room, { foreignKey: "roomTypeId" });
  Room.belongsTo(RoomType, { foreignKey: "roomTypeId" });
  Room.hasMany(RoomImage, { foreignKey: "roomId" });
  RoomImage.belongsTo(Room, { foreignKey: "roomId" });
  Room.findAll({
    include: [RoomType, RoomImage],
    where: { roomTypeId: id },
    order: [["roomNo", "ASC"]],
  })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  RoomType.hasMany(Room, { foreignKey: "roomTypeId" });
  Room.belongsTo(RoomType, { foreignKey: "roomTypeId" });
  Room.hasMany(RoomImage, { foreignKey: "roomId" });
  RoomImage.belongsTo(Room, { foreignKey: "roomId" });
  Room.findOne({ include: [RoomType, RoomImage], where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const { images } = req.body;
  Room.update({ ...req.body }, { where: { id: id } })
    .then(async (data) => {
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          await RoomImage.create({ roomId: id, image: images[i] });
        }
      }
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Room.destroy({ where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.deleteRoomImage = (req, res) => {
  const id = req.params.id;
  RoomImage.destroy({ where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};
