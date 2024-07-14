const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const RoomType = require("../models/room.type.model");

const Room = sequelize.define(
  "rooms",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roomTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: RoomType,
        key: "id",
      },
    },
    roomNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastCheckIn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastCheckOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, //1 empty, 2 can book more, 3 not empty
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = Room;
