require("dotenv").config();
const router = require("express").Router();
const { error } = require("console");
const db = require("../Connection/dbconnection");

// Multer and Cloudinary setup
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.API_key,
  api_secret: process.env.API_secret,
  secure: true,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload file to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null); // Indicates the end of the stream

    let chunks = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    stream.on("end", () => {
      const fileBuffer = Buffer.concat(chunks);

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "video",
            folder: "course_video/101", // Specify the folder name
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        )
        .end(fileBuffer);
    });
    stream.on("error", (error) => {
      reject(error);
    });
  });
};

// Route handler for handling multiple file uploads
router.post("/", upload.array("video", 5), async (req, res) => {
  try {
    const course = req.body.course;
    const files = req.files;
    const descriptions = req.body.descriptions;
    // console.log(descriptions, course);

    // Check if files were uploaded
    if (!files || files.length === 0) {
      return res.status(400).send("No files uploaded");
    }

    const uploadResults = [];

    // Upload each file to Cloudinary
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const description = descriptions[i]; // Get corresponding description

      const result = await uploadToCloudinary(file);
      uploadResults.push({ url: result, description }); // Store URL and description
    }
    // Store upload results in the database
    // const response = await uploadcoursecard(course, uploadResults);

    // if (response.success) {
    //   res.redirect("/Dashboard"); // Redirect on success
    // } else {
    //   res.status(500).json("Failed to store in the database");
    // }
    const response = await db.uploadcourse(course, uploadResults);
    console.log(response);
    if (response.success) {
      res.redirect("/Dashboard");
    } else {
      res.status(500).send(error);
    }
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).send("Error uploading files: " + error.message);
  }
});

module.exports = router;
