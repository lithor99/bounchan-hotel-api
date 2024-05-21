const sequelize = require("../configs/db");
const { sendMail } = require("../functions/send.mail");
module.exports.sendCheckInNotification =
  async function sendCheckInNotification() {
    try {
      const booking = await sequelize.query(
        `SELECT m.email, LEFT(b.checkInDate, 10) AS checkInDate FROM books b 
        INNER JOIN members m ON b.memberId = m.id
        WHERE b.status=1 AND Date(b.checkInDate) = CURDATE()`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      for (let i = 0; i < booking.length; i++) {
        const { email, checkInDate } = booking[i];
        await sendMail(
          email,
          "ໂຮງແຮມບຸນຈັນ",
          `ວັນທີແຈ້ງເຂົ້າຂອງທ່ານແມ່ນ: ${checkInDate}`
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

module.exports.sendCheckOutNotification =
  async function sendCheckOutNotification() {
    try {
      const booking = await sequelize.query(
        `SELECT m.email, LEFT(b.checkOutDate, 10) AS checkOutDate FROM books b 
        INNER JOIN members m ON b.memberId = m.id
        WHERE b.status=2 AND Date(b.checkOutDate) = CURDATE()`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      for (let i = 0; i < booking.length; i++) {
        const { email, checkOutDate } = booking[i];
        await sendMail(
          email,
          "ໂຮງແຮມບຸນຈັນ",
          `ກະລຸນາແຈ້ງອອກກ່ອນເວລາ: ${checkOutDate} 12:00 AM`
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
