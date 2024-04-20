const router = require("express").Router();
const db = require("../Connection/dbconnection");
const sendMail = require("../services/emailservices");

function generateRandomSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  const otp = generateRandomSixDigitNumber();

  try {
    const response = db.addUser(name, email, password, otp); // Ensure await here

    if (response.message === "Appeared") {
      return res.status(400).send("User email is already present"); // Use return to stop execution
    } else {
      // Send email with OTP
      sendMail({
        from: process.env.FROM_MAIL,
        to: email,
        subject: "Registration OTP",
        text: `Your One Time Password (OTP) is: ${otp}`,
        html: `<p>Your One Time Password (OTP) is: <strong>${otp}</strong></p>`,
      });

      res.status(200).json({
        email: email,
      });
    }
  } catch (error) {
    res.status(500).send("Failed to add user. Please try again later.");
  }
});
module.exports = router;
