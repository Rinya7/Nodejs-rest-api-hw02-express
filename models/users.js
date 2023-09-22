const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET } = process.env;
const HttpError = require("../service/helpers/HttpError");

const { reg, log, getById } = require("../service/users");

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
    const newUser = await reg(req.body);

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

//const current = async (req, res, next) => {
//  const id = req.params.contactId;
//  try {
//    const contact = await getById(id);
//    if (!contact) {
//      HttpError(401);
//    }
//    res.status(200).json(contact);
//  } catch (error) {
//    next(error);
//  }
//};

const login = async (req, res, next) => {
  const { error } = addUserValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      message: `Error in required field: ${error.details[0].path[0]}`,
    });
  }
  try {
    const logUser = await log(req.body);

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

module.exports = {
  register,
  login,
  //  current,
};
