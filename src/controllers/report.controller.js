const Member = require("../models/member.model");
const Book = require("../models/book.model");
const BookDetail = require("../models/book.detail.model");
const { Op } = require("sequelize");
const sequelize = require("../configs/db");

exports.reportMember = (req, res) => {
  const { startDate, endDate } = req.query;
  Member.findAndCountAll({
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
};

exports.reportBook = (req, res) => {
  const { startDate, endDate } = req.query;
  Book.hasMany(BookDetail, { foreignKey: "bookId" });
  BookDetail.belongsTo(Book, { foreignKey: "bookId" });

  Book.findAndCountAll({
    include: [BookDetail],
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
};

exports.reportIncome = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    var data = [];
    const dates = await sequelize.query(
      `SELECT LEFT(b.createdAt, 10) AS date FROM books b 
      WHERE (b.status=2 OR b.status=3) AND (LEFT(b.createdAt, 10) BETWEEN '${startDate}' AND '${endDate}')
      GROUP BY date`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    for (let i = 0; i < dates.length; i++) {
      const income = await sequelize.query(
        `SELECT count(b.id) AS count, SUM(b.amount) AS amount FROM books b
        WHERE LEFT(b.createdAt, 10)='${dates[i].date}'`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      data.push({
        date: dates[i].date,
        count: income[0].count,
        amount: income[0].amount,
      });
    }
    return res.status(200).json({ result: data });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ result: error });
  }
};
