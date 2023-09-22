const ContactSchema = require("../service/schemas/contactSchema");

const {
  //  getAll,
  getById,
  create,
  update,
  remove,
} = require("../service/contacts");

const HttpError = require("../service/helpers/HttpError");

const {
  addContactValidationSchema,
  updateStatusFavorite,
} = require("../utils/validation/ValidationSchema.js");

const listContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const contactsAll = await ContactSchema.find(
      { owner },
      {},
      { skip, limit }
    );

    return res.status(200).json({ status: "success", code: 200, contactsAll });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  const id = req.params.contactId;
  try {
    const contact = await getById(id);
    if (!contact) {
      HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  const id = req.params.contactId;
  try {
    const contact = await remove(id);
    if (!contact) {
      HttpError(404);
    }

    return res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  const { error } = addContactValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      message: `Error in required field: ${error.details[0].path[0]}`,
    });
  }
  try {
    const { _id: owner } = req.user;
    const newContact = await create({ ...req.body, owner });
    return res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  const id = req.params.contactId;
  const { error } = addContactValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      message: `Error in required field: ${error.details[0].path[0]}`,
    });
  }
  try {
    const contact = await update(id, req.body);
    if (!contact) {
      HttpError(404);
    }
    if (!req.body) {
      return res.status(400).json({ message: "missing fields" });
    }
    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  const id = req.params.contactId;
  const { error } = updateStatusFavorite.validate(req.body);
  if (error) {
    return res.status(400).send({
      message: `Error in required field: ${error.details[0].path[0]}`,
    });
  }
  try {
    const contact = await update(id, req.body);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    if (!req.body) {
      HttpError(400);
    }
    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
