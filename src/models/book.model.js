const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const Member = require("../models/member.model");
const Staff = require("../models/staff.model");

const Book = sequelize.define(
  "books",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    memberId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Member,
        key: "id",
      },
    },
    billNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    checkInDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOutDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkInBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Staff,
        key: "id",
      },
    },
    checkOutBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Staff,
        key: "id",
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1:new, 2:checked in, 3:checked out, 4:cancel
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = Book;
