const admin = require("firebase-admin");

const serviceAccount = require("../../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://bounchan-app.appspot.com", // Replace this with your Firebase Storage bucket URL
});

const bucket = admin.storage().bucket();

async function uploadFileToStorage(filePath, destination) {
  try {
    await bucket.upload(filePath, {
      destination: destination,
    });
    console.log("File uploaded successfully.");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

// Usage example:
const filePath = "/path/to/local/file.jpg";
const destination = "images/file.jpg"; // Specify the destination path in Firebase Storage

uploadFileToStorage(filePath, destination);
