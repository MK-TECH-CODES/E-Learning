require("dotenv").config();
const multer = require("multer");
const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const { uploadcoursecard } = require("../Connection/dbconnection");

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
      const fileStr = fileBuffer.toString("base64");
      cloudinary.uploader.upload(
        "data:image/png;base64," + fileStr,
        {
          resource_type: "image",
          folder: "course_image", // Specify the folder name
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
    });
    stream.on("error", (error) => {
      reject(error);
    });
  });
};

router.post("/", upload.single("video"), async (req, res) => {
  try {
    const videoFile = req.file;
    const { title, author, description, course } = req.body;
    console.log(title, author, description, course);

    // Print the file name to console
    console.log("Uploaded file name:", videoFile.originalname);

    if (!videoFile) {
      // If no file is uploaded, send an error response
      return res.status(400).send("No file uploaded");
    } else {
      // Upload file to Cloudinary
      const result = await uploadToCloudinary(videoFile);

      // db store
      const response = await uploadcoursecard(
        title,
        author,
        description,
        result,
        course
      );
      console.log(response);
      if (response.success) {
        // If upload is successful, send the result
        // res.redirect("/Dashboard");
        res.redirect("/Dashboard");
      } else {
        res.status(500).json("Failed");
      }
    }
  } catch (error) {
    // If there's an error, send an error response
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
});

module.exports = router;
