const express = require("express");
const router = express.Router();

const { register, login, current, logout } = require("../../models/users");
const authenticate = require("../../utils/authenticate");

router.post("/register", register);
router.post("/login", login);
router.get("/current", authenticate, current);
router.post("/logout", authenticate, logout);

module.exports = router;
