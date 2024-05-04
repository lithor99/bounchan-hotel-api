const admin = require("firebase-admin");
// const serviceAccount = require("../../serviceAccount.json");
// admin.initializeApp({
//   credential: admin.credential.cert(require(serviceAccount)),
// });
const messaging = admin.messaging();
const Member = require("../models/member.model");
const Staff = require("../models/staff.model");

module.exports.pushNotificationToStaff = async function pushNotificationToStaff(
  title,
  body
) {
  const deviceTokens = await Member.findAll({
    attributes: ["deviceToken"],
  });
  console.log(deviceTokens[0]);
  if (deviceTokens.length > 0) {
    for (let i = 0; i < deviceTokens.length; i++) {
      const message = {
        notification: {
          title,
          body: body,
        },
        token: deviceTokens[i],
      };
      try {
        const response = await messaging.send(message);
        console.log("Successfully sent message:", response);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }
};

module.exports.pushNotificationToMember =
  async function pushNotificationToMember(id, title, body) {
    const deviceToken = await Staff.findOne({
      attributes: ["deviceToken"],
      where: { id: id },
    });
    console.log(deviceToken);
    if (deviceToken) {
      let message = {
        notification: {
          title,
          body: body,
        },
        token: deviceToken,
      };
      try {
        const response = await messaging.send(message);
        console.log("Successfully sent message:", response);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
