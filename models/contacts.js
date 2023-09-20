const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../service/contacts");

const {
  addContactValidationSchema,
  updateStatusFavorite,
} = require("../utils/validation/ValidationSchema.js");

const listContacts = async (req, res, next) => {
  try {
    const contactsAll = await getAll();

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
      return res.status(404).json({ message: "Not found" });
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
      return res.status(404).json({ message: "Not found" });
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
    const newContact = await create(req.body);
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
      return res.status(400).json({ message: "Contact not found" });
    }
    if (!req.body) {
      return res.status(400).json({ message: "missing fields" });
    }
    return res.status(404).json(contact);
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
      return res.status(400).json({ message: "Contact not found" });
    }
    if (!req.body) {
      return res.status(400).json({ message: "missing fields" });
    }
    return res.status(404).json(contact);
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
