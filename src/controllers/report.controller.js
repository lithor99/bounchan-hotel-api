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
  const { startDate, endDate, status } = req.query;
  Book.hasMany(BookDetail, { foreignKey: "bookId" });
  BookDetail.belongsTo(Book, { foreignKey: "bookId" });
  if (status != null && status != "") {
    Book.findAndCountAll({
      include: [BookDetail],
      where: {
        status: status,
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
  }
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
        WHERE (b.status=2 OR b.status=3) AND LEFT(b.createdAt, 10)='${dates[i].date}'`,
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

exports.reportChart = async (req, res) => {
  const { year } = req.query;
  try {
    let data = [];
    for (let i = 1; i <= 12; i++) {
      let month;
      if (i < 10) {
        month = `0${i}`;
      }
      const member = await sequelize.query(
        `SELECT COUNT(id) AS count FROM members
        WHERE LEFT(createdAt, 7) = '${year}-${month}'`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const success = await sequelize.query(
        `SELECT COUNT(id) AS count FROM books 
        WHERE LEFT(createdAt, 7) = '${year}-${month}'
        AND status != 4`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const cancel = await sequelize.query(
        `SELECT COUNT(id) AS count FROM books 
        WHERE LEFT(createdAt, 7) = '${year}-${month}'
        AND status = 4`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const income = await sequelize.query(
        `SELECT SUM(amount) AS amount FROM books
        WHERE LEFT(createdAt, 7) = '${year}-${month}'
        AND (status=2 OR status=3)`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      data.push({
        month: month,
        member: member[0].count ?? 0,
        book: {
          success: success[0].count ?? 0,
          cancel: cancel[0].count ?? 0,
        },
        income: income[0].amount ?? 0,
      });
    }
    return res.status(200).json({ result: data });
  } catch (error) {
    return res.status(400).json({ result: error });
  }
};
