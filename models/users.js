const { reg, log } = require("../service/users");

const {
  addUserValidationSchema,
} = require("../utils/validation/addContactValidationSchema.js");

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
    console.error(error.message);
  }
};

const login = async (req, res, next) => {
  const id = req.params.contactId;
  try {
    const contact = await log(id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  register,
  login,
};
