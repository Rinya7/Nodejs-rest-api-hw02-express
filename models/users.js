const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const Jimp = require("jimp");
require("dotenv").config();
const { SECRET } = process.env;
const UserSchema = require("../service/schemas/userSchema");

const {
  addUserValidationSchema,
} = require("../utils/validation/ValidationSchema.js");
const HttpError = require("../service/helpers/HttpError");

const register = async (req, res, next) => {
  const { error } = addUserValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      message: `Error in required field: ${error.details[0].path[0]}`,
    });
  }
  try {
    let avatarUrl;
    // перенос файла в папку аватарс:
    if (req.file) {
      console.log("req.file", req.file);
      const { path: tempUpload, filename } = req.file;
      //  console.log("req.file", req.file);
      const avatarsDir = path.join(process.cwd(), "public", "avatars");
      const resultUpload = path.join(avatarsDir, filename);
      await fs.rename(tempUpload, resultUpload);

      const jimpImage = await Jimp.read(resultUpload);
      await jimpImage.resize(250, 250).writeAsync(resultUpload);

      avatarUrl = resultUpload;
    } else {
      const { email } = req.body;
      const options = {
        s: "200",
        r: "pg",
        d: "mm",
      };
      avatarUrl = gravatar.url(email, options);
    }
    // end
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const newUser = await UserSchema.create({
      ...req.body,
      password: passwordHash,
      avatarUrl,
    });

    if (newUser) {
      return res.status(201).json(newUser);
    }
  } catch (error) {
    if (error.keyValue.email === req.body.email) {
      res.status(409).send({
        message: "Email in use",
      });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  const { error } = addUserValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      message: `Error in required field: ${error.details[0].path[0]}`,
    });
  }
  try {
    const logUser = await UserSchema.findOne({ email: req.body.email });

    if (logUser) {
      const isValide = await bcrypt.compare(
        req.body.password,
        logUser.password
      );
      if (!isValide) {
        return res.status(401).send({ message: "Email or password is wrong" });
      }

      const payload = {
        id: logUser.id,
      };
      const token = jwt.sign(payload, SECRET, { expiresIn: "23h" });
      await UserSchema.findByIdAndUpdate(logUser._id, { token });
      return res.status(200).json({
        token,
        user: {
          email: logUser.email,
          subscription: logUser.subscription,
        },
      });
    }
    return res.status(401).send({ message: "Email or password is wrong" });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.status(200).json({ email, subscription });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await UserSchema.findByIdAndUpdate(_id, { token: "" });
    res.status(200).json({ message: "Logout succes" });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;

  try {
    if (!req.file) {
      return next(HttpError(404));
    }
    const { path: tempUpload, filename } = req.file;
    const avatarsDir = path.join(process.cwd(), "public", "avatars");
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);

    const jimpImage = await Jimp.read(resultUpload);
    await jimpImage.resize(250, 250).writeAsync(resultUpload);

    const updateUserAvatar = await UserSchema.findByIdAndUpdate(
      _id,
      { avatarUrl: resultUpload },
      { new: true }
    );
    if (updateUserAvatar) {
      return res.status(200).json(updateUserAvatar);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  current,
  logout,
  updateAvatar,
};
