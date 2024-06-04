const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const admin = require("firebase-admin");
const formidable = require("formidable");
const {
  sendCheckInNotification,
  sendCheckOutNotification,
  cancelBookingAutomatic,
} = require("./src/functions/send.notification");
const schedule = require("node-schedule");

const serviceAccount = require("./serviceAccount.json");

const app = express();
app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://bounchan-app.appspot.com", // Replace this with your Firebase Storage bucket URL
});

//send check in notification to email when time is 12:00 by 24 hours format
schedule.scheduleJob("0 12 * * *", () => {
  sendCheckInNotification();
});

//send check out notification to email when time is 10:00 by 24 hours format
schedule.scheduleJob("0 10 * * *", () => {
  sendCheckOutNotification();
});

//cancel booking auto and send email when time is 23:30  by 24 hours format
schedule.scheduleJob("30 23 * * *", () => {
  cancelBookingAutomatic();
});

const bucket = admin.storage().bucket();

app.get("/", (req, res) => {
  return res.json("Welcome to bounchan hotel api");
});

app.post("/upload", (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing the files");
      return res.status(400).send("Error parsing the files");
    }

    try {
      const file = files.file; // 'file' is the name of the field in your form

      const { filepath, originalFilename } = file[0];
      // Upload the file to Firebase Storage
      const uploadResponse = await bucket.upload(filepath, {
        destination: `uploads/${originalFilename}`,
      });

      // Get the public URL of the uploaded file
      const fileRef = uploadResponse[0];
      const [url] = await fileRef.getSignedUrl({
        action: "read",
        expires: "03-01-2500", // Date far in the future
      });

      res.status(200).send({ url });
    } catch (uploadError) {
      console.error("Error uploading file:", uploadError);
      res.status(500).send("Failed to upload file");
    }
  });
});

//use routes
require("./src/routes/member.routes")(app);
require("./src/routes/staff.routes")(app);
require("./src/routes/room.type.routes")(app);
require("./src/routes/room.image.routes")(app);
require("./src/routes/room.routes")(app);
require("./src/routes/book.routes")(app);
require("./src/routes/send.mail.routes")(app);
require("./src/routes/otp.routes")(app);
require("./src/routes/report.routes")(app);
const port = process.env.PORT || 8888;

app.listen(port, () => {
  console.log(`Server is runing on port: ${port}`);
});
