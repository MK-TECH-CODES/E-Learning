const router = require("express").Router();
const db = require("../Connection/dbconnection");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const response = await db.logincheck(email, password);
  console.log(response);
  if (response.message == "admin") {
    res.status(200).json({ data: "admin" });
  } else if (response.success) {
    res.status(200).json({ data: "user" });
  } else {
    res.status(500).json({ data: "Failed to Login" });
  }
});

module.exports = router;
