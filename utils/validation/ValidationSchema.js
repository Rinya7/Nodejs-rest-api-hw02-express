const Joi = require("joi");

const addContactValidationSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().required(),
});

const addUserValidationSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateStatusFavorite = Joi.object().keys({
  favorite: Joi.boolean().required(),
});

const emailSchema = Joi.object().keys({
  email: Joi.string().required(),
});

module.exports = {
  addContactValidationSchema,
  updateStatusFavorite,
  addUserValidationSchema,
  emailSchema,
};
