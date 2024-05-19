const Room = require("../models/room.model");
const Member = require("../models/member.model");
const Book = require("../models/book.model");
const BookDetail = require("../models/book.detail.model");
const { Op } = require("sequelize");
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
        const room = await Room.findOne({
          where: { id: item.rooms[i].roomId },
        });
        if (room.status == 1) {
          Room.update(
            { status: 2, lastCheckOut: item.checkOutDate },
            { where: { id: item.rooms[i].roomId } }
          );
        } else if (room.status == 2) {
          Room.update(
            { status: 3, lastCheckOut: item.checkOutDate },
            { where: { id: item.rooms[i].roomId } }
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
  const { status, startDate, endDate } = req.query;
  Member.hasMany(Book, { foreignKey: "memberId" });
  Book.belongsTo(Member, { foreignKey: "memberId" });
  if (status) {
    if (startDate && endDate) {
      console.log("================= 1");
      Book.findAndCountAll({
        include: [Member],
        where: {
          status: status ?? 1,
          createdAt: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
      })
        .then((data) => {
          return res.status(200).json({ result: data });
        })
        .catch((error) => {
          return res.status(400).json({ result: error });
        });
    } else {
      console.log("================= 2");
      Book.findAndCountAll({
        include: [Member],
        where: {
          status: status ?? 1,
        },
      })
        .then((data) => {
          return res.status(200).json({ result: data });
        })
        .catch((error) => {
          return res.status(400).json({ result: error });
        });
    }
  } else {
    if (startDate && endDate) {
      console.log("================= 3");
      Book.findAndCountAll({
        include: [Member],
        where: {
          createdAt: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
      })
        .then((data) => {
          return res.status(200).json({ result: data });
        })
        .catch((error) => {
          return res.status(400).json({ result: error });
        });
    } else {
      console.log("================= 4");
      Book.findAndCountAll({
        include: [Member],
      })
        .then((data) => {
          return res.status(200).json({ result: data });
        })
        .catch((error) => {
          return res.status(400).json({ result: error });
        });
    }
  }
};

exports.findByMember = (req, res) => {
  const id = req.params.id;
  Member.hasMany(Book, { foreignKey: "memberId" });
  Book.belongsTo(Member, { foreignKey: "memberId" });
  Book.findAndCountAll({
    include: [Member],
    where: { memberId: id },
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
  Member.hasMany(Book, { foreignKey: "memberId" });
  Book.belongsTo(Member, { foreignKey: "memberId" });
  Book.hasMany(BookDetail, { foreignKey: "bookId" });
  BookDetail.belongsTo(Book, { foreignKey: "bookId" });
  Book.findOne({
    include: [Member, BookDetail],
    where: { id: id },
  })
    .then(async (data) => {
      if (data) {
        for (let i = 0; i < data.book_details.length; i++) {
          var room = await Room.findOne({
            where: { id: data.book_details[i].roomId },
          });

          data.book_details[i].dataValues = {
            ...data.book_details[i].dataValues,
            roomNo: room.roomNo,
          };
        }
        return res.status(200).json({ result: data });
      } else {
        return res.status(400).json({ result: data });
      }
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
  const { bookId } = req.params;
  Book.update({ status: 2, checkInBy: id }, { where: { id: bookId } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.checkOut = (req, res) => {
  const { id } = req.payload;
  const { bookId } = req.params;
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

exports.manualBook = async (req, res) => {
  const { id } = req.payload;
  const { item } = req.body;
  console.log("====================================");
  console.log(item);
  console.log("====================================2");
  const member = await Member.findOne({ where: { memberType: 0 } });
  console.log(member);
  console.log("====================================");
  Book.create({
    memberId: member.id,
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
          status: 2,
          checkInBy: id,
        });
        const room = await Room.findOne({
          where: { id: item.rooms[i].roomId },
        });
        if (room.status == 1) {
          Room.update(
            { status: 2, lastCheckOut: item.checkOutDate },
            { where: { id: item.rooms[i].roomId } }
          );
        } else if (room.status == 2) {
          Room.update(
            { status: 3, lastCheckOut: item.checkOutDate },
            { where: { id: item.rooms[i].roomId } }
          );
        }
      }
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(400).json({ result: error });
    });
};

exports.cancelBook = (req, res) => {
  const { id } = req.payload;
  const { bookId } = req.params;
  Book.update(
    { status: 4, checkInBy: id, checkOutBy: id },
    { where: { id: bookId } }
  )
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
