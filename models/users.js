const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const Jimp = require("jimp");
require("dotenv").config();
const { SECRET, BASE_URL } = process.env;

const UserSchema = require("../service/schemas/userSchema");

const {
  addUserValidationSchema,
} = require("../utils/validation/ValidationSchema.js");
const httpError = require("../service/helpers/httpError");
const sendEmail = require("../service/helpers/sendEmail");
const { v4: uuidv4 } = require("uuid");

const register = async (req, res, next) => {
  const { email, password } = req.body;
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
      const { path: tempUpload, filename } = req.file;

      const avatarsDir = path.join(process.cwd(), "public", "avatars");
      const resultUpload = path.join(avatarsDir, filename);
      await fs.rename(tempUpload, resultUpload);

      const jimpImage = await Jimp.read(resultUpload);
      await jimpImage.resize(250, 250).writeAsync(resultUpload);

      avatarUrl = resultUpload;
    } else {
      //  const { email } = req.body;
      const options = {
        s: "200",
        r: "pg",
        d: "mm",
      };
      avatarUrl = gravatar.url(email, options);
    }
    // end

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const newUser = await UserSchema.create({
      ...req.body,
      password: passwordHash,
      avatarUrl,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a href="${BASE_URL}/api/users/auth/verify/${verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    if (newUser) {
      return res.status(201).json(newUser);
    }
  } catch (error) {
    if (error.keyValue.email === email) {
      res.status(409).send({
        message: "Email in use",
      });
    }
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await UserSchema.findOne({ verificationToken });
  if (!user) {
    return next(httpError(404));
  }
  await UserSchema.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  return res.status(200).send({ message: "Verification successful" });
};

const reSendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({
      message: "missing required field email",
    });
  }

  const user = await UserSchema.findOne({ email });

  const { verificationToken } = user;

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/auth/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);
  return res.status(200).send({ message: "Verification email sent" });
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
      return next(httpError(404));
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
  verifyEmail,
  reSendVerifyEmail,
};
