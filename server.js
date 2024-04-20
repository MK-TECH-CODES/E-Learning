const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// Database connections
const db = require("./Connection/dbconnection");

// app creation
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// setting the view sites
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// For the db connections
db.getPgVersion();

// Home page
app.get("/", async (req, res) => {
  try {
    const data = await db.totaldata();
    if (data) {
      const courseList = {};
      for (let i = 0; i < data.length; i++) {
        const course = data[i].course_type;
        if (courseList[course]) {
          // If it does, push the current index to the array
          courseList[course].push(i);
        } else {
          // If it doesn't, create a new array with the current index
          courseList[course] = [i];
        }
      }
      const keys = Object.keys(courseList);

      // for (let i = 0; i < keys.length; i++) {
      //   console.log(courseList[keys[i]]);
      //   for (let j = 0; j < courseList[keys[i]].length; j++) {
      //     console.log(courseList[keys[i]][j]);
      //   }
      // }

      // Print the length in the console
      res.render("index", {
        totalElements: data,
        course: keys,
        courseList: courseList,
      });
    } else {
      console.log("No data found");
      res.status(404).send("No data found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});
app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signin.html"));
});

// User Register
app.use("/userRegister", require("./routes/newuser"));

// email services
app.get("/emailverification", (req, res) => {
  const userEmail = req.query.email; // Extract email from query parameter
  res.render("emailverification", { email: userEmail });
});

// OTP verify
app.use("/verifyOTP", require("./routes/verifyotp"));
app.get("/Home", async (req, res) => {
  try {
    const data = await db.totaldata();
    if (data && data.length > 0) {
      const courseList = {};
      for (let i = 0; i < data.length; i++) {
        const course = data[i].course_type;
        if (courseList[course]) {
          // If it does, push the current index to the array
          courseList[course].push(i);
        } else {
          // If it doesn't, create a new array with the current index
          courseList[course] = [i];
        }
      }
      const keys = Object.keys(courseList);

      // for (let i = 0; i < keys.length; i++) {
      //   console.log(courseList[keys[i]]);
      //   for (let j = 0; j < courseList[keys[i]].length; j++) {
      //     console.log(courseList[keys[i]][j]);
      //   }
      // }

      // Print the length in the console
      res.render("home", {
        totalElements: data,
        course: keys,
        courseList: courseList,
      });
    } else {
      console.log("No data found");
      res.status(404).send("No data found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

// signin
app.use("/loginUser", require("./routes/userlogin"));
app.get("/Dashboard", async (req, res) => {
  try {
    const data = await db.totaldata();
    if (data) {
      const courseList = {};
      for (let i = 0; i < data.length; i++) {
        const course = data[i].course_type;
        if (courseList[course]) {
          // If it does, push the current index to the array
          courseList[course].push(i);
        } else {
          // If it doesn't, create a new array with the current index
          courseList[course] = [i];
        }
      }
      const keys = Object.keys(courseList);

      // for (let i = 0; i < keys.length; i++) {
      //   console.log(courseList[keys[i]]);
      //   for (let j = 0; j < courseList[keys[i]].length; j++) {
      //     console.log(courseList[keys[i]][j]);
      //   }
      // }
      // console.log(keys, courseList);
      res.render("dashboard", {
        totalElements: data,
        course: keys,
        courseList: courseList,
      });
    } else {
      console.log("No data found");
      res.status(404).send("No data found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

//upload data to cloud
app.use("/upload", require("./routes/uploaddata"));

// For playing video
app.get("/user/playing", async (req, res) => {
  try {
    const { item } = req.query;
    console.log("Item:", item);
    const data = await db.tablefind(item);
    if (data) {
      res.render("playing", { videodata: data });
    } else {
      console.log("No data found");
      res.status(404).send("No data found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

// upload video
app.use("/videoupload", require("./routes/videoupload"));

// server connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running in 3000");
});
