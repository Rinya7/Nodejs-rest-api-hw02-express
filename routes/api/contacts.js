const express = require("express");
const router = express.Router();

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");
const authenticate = require("../../utils/authenticate");

router.get("/", authenticate, listContacts);

router.get("/:contactId", authenticate, getContactById);

router.post("/", authenticate, addContact);

router.delete("/:contactId", authenticate, removeContact);

router.put("/:contactId", authenticate, updateContact);

router.patch("/:contactId/favorite", authenticate, updateStatusContact);

module.exports = router;
