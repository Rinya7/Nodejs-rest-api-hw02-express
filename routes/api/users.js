const express = require("express");
const router = express.Router();

const {
  register,
  login,
  //current
} = require("../../models/users");

router.post("/register", register);
router.post("/login", login);
//router.post("/login", current);

module.exports = router;
