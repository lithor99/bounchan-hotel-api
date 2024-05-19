const Room = require("../models/room.model");
const RoomType = require("../models/room.type.model");
const RoomImage = require("../models/room.image.model");

exports.create = (req, res) => {
  const { images } = req.body;
  console.log("--------------------");
  console.log(req.body);
  console.log("--------------------");
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
  RoomType.hasMany(Room, { foreignKey: "roomTypeId" });
  Room.belongsTo(RoomType, { foreignKey: "roomTypeId" });
  Room.hasMany(RoomImage, { foreignKey: "roomId" });
  RoomImage.belongsTo(Room, { foreignKey: "roomId" });
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
};

exports.findRoomMember = (req, res) => {
  RoomType.findAll()
    .then(async (data) => {
      if (data.length > 0) {
        var rooms = [];
        for (let i = 0; i < data.length; i++) {
          RoomType.hasMany(Room, { foreignKey: "roomTypeId" });
          Room.belongsTo(RoomType, { foreignKey: "roomTypeId" });
          Room.hasMany(RoomImage, { foreignKey: "roomId" });
          RoomImage.belongsTo(Room, { foreignKey: "roomId" });
          var room = await Room.findAll({
            include: [RoomType, RoomImage],
            where: { roomTypeId: data[i].id },
            order: [["roomNo", "ASC"]],
          });
          rooms.push({ roomType: data[i], rooms: room });
        }
        return res.status(200).json({ result: rooms });
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
