const express = require("express");
const router = express.Router();

const {
  register,
  login,
  current,
  logout,
  updateAvatar,
} = require("../../models/users");
const authenticate = require("../../utils/authenticate");
const upload = require("../../utils/upload");

//при загрузке группы файлов: upload.array("avatar", 9) где 9 макс кол-во файлов.
//при загрузке группы файлов в разных полях: upload.filds([{name: "avatar", maxCount: 6}, {name: "logo", maxCount: 2}]) .

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/current", authenticate, current);
router.post("/logout", authenticate, logout);
router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
