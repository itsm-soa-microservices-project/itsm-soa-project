const express = require("express");
const authClient = require("../../grpc-clients/auth.client");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  authClient.Login({ email, password }, (err, response) => {
    if (err) return res.status(500).json({ error: err.message || err });
    res.json(response);
  });
});

module.exports = router;