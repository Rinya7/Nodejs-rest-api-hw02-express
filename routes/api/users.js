const express = require("express");
const router = express.Router();

const { register, login } = require("../../models/users");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
