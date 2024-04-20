const router = require("express").Router();
const db = require("../Connection/dbconnection");

router.post("/", async (req, res) => {
  const { otp, email } = req.body;
  const response = await db.checkemail(email, otp);
  console.log(response.success);
  if (response.success) {
    res.status(200).json("OTP Verified");
  } else {
    res.status(500).json("OTP Verification Failed");
  }
});

module.exports = router;
