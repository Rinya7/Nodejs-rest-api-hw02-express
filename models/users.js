const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET } = process.env;
const UserSchema = require("../service/schemas/userSchema");

const {
  addUserValidationSchema,
} = require("../utils/validation/ValidationSchema.js");

const register = async (req, res, next) => {
  const { error } = addUserValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      message: `Error in required field: ${error.details[0].path[0]}`,
    });
  }
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const newUser = await UserSchema.create({
      ...req.body,
      password: passwordHash,
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
  await UserSchema.findByIdAndUpdate(_id, { token: "" });
  res.status(200).json({ message: "Logout succes" });
};

module.exports = {
  register,
  login,
  current,
  logout,
};
