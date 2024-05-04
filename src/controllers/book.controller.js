const Room = require("../models/room.model");
const Member = require("../models/member.model");
const Book = require("../models/book.model");
const BookDetail = require("../models/book.detail.model");
const { pushNotificationToStaff } = require("../functions/push.notification");

exports.create = (req, res) => {
  const { id } = req.payload;
  const { item } = req.body;
  Book.create({
    memberId: id,
    amount: item.amount,
    checkInDate: item.checkInDate,
    checkOutDate: item.checkOutDate,
  })
    .then(async (data) => {
      for (let i = 0; i < item.rooms.length; i++) {
        BookDetail.create({
          bookId: data.id,
          roomId: item.rooms[i].roomId,
          price: item.rooms[i].price,
        });
        const room = await Room.findOne({ where: { id: data.id } });
        if (room.status == 1) {
          Room.update(
            { status: 2, lastCheckOut: new Date() },
            { where: { id: data.id } }
          );
        } else if (room.status == 2) {
          Room.update(
            { status: 3, lastCheckOut: new Date() },
            { where: { id: data.id } }
          );
        }
      }
      pushNotificationToStaff("ແຈ້ງເຕືອນ", "ມີການຈອງຫ້ອງຈາກລູກຄ້າ");
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.findAll = (req, res) => {
  const { status } = req.query;
  Member.hasMany(Book, { foreignKey: "memberId" });
  Book.belongsTo(Member, { foreignKey: "memberId" });
  Book.findAndCountAll({
    include: [Member],
    where: { status: status ?? 1 },
  })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.findByMember = (req, res) => {
  const id = req.params.id;
  const { status } = req.query;
  Member.hasMany(Book, { foreignKey: "memberId" });
  Book.belongsTo(Member, { foreignKey: "memberId" });
  Book.findAndCountAll({
    include: [Member],
    where: { memberId: id, status: status },
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
  Room.hasMany(BookDetail, { foreignKey: "roomId" });
  BookDetail.belongsTo(Room, { foreignKey: "roomId" });
  BookDetail.findAll({ include: [Room], where: { bookId: id } })
    .then((data) => {
      // if (bookDetail) {
      //   Room.findAll({ where: { id: bookDetail.roomId } })
      //     .then((rooms) => {
      //       const data = { bookDetail, rooms: rooms };
      return res.status(200).json({ result: data });
      //     })
      //     .catch((error) => {
      //       return res.status(400).json({ result: error });
      //     });
      // } else {
      //   return res.status(400).json({ result: "Something went wrong" });
      // }
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.updateBook = (req, res) => {
  const id = req.params.id;
  Book.update({ ...req.body }, { where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.updateBookDetail = (req, res) => {
  const id = req.params.id; // book detail id
  BookDetail.destroy({ where: { id: id } })
    .then(async (data) => {
      const count = await BookDetail.count({ where: { bookId: data.bookId } });
      if (count < 1) {
        await Book.destroy({ where: { bookId: data.bookId } });
      } else {
        await Book.update(
          { amount: Sequelize.literal(`amount - ${data.price}`) },
          { where: { id: data.bookId } }
        );
      }
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.checkIn = (req, res) => {
  const { id } = req.payload;
  const bookId = req.params.id;
  Book.update({ status: 2, checkInBy: id }, { where: { id: bookId } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.checkOut = (req, res) => {
  const id = req.params.id;
  const bookId = req.params.id;
  Book.update({ status: 3, checkOutBy: id }, { where: { id: bookId } })
    .then(async (data) => {
      const bookDetails = await BookDetail.findAll({
        where: { bookId: bookId },
      });
      for (let i = 0; i < bookDetails.length; i++) {
        const room = await Room.findOne({
          where: { id: bookDetails[i].roomId },
        });
        if (room.status == 2) {
          room.update(
            { status: 1, lastCheckOut: null },
            { where: { id: bookDetails[i].roomId } }
          );
        }
        if (room.status == 3) {
          room.update({ status: 2 }, { where: { id: bookDetails[i].roomId } });
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
  BookDetail.destroy({ where: { id: id } })
    .then((data) => {
      if (data) {
        Book.destroy({ where: { id: id } })
          .then((data) => {
            return res.status(200).json({ result: data });
          })
          .catch((error) => {
            return res.status(400).json({ result: error });
          });
      } else {
        return res.status(400).json({ result: error });
      }
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};
