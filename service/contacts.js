const ContactSchema = require("./schemas/contactSchema");

const getAll = async () => {
  return await ContactSchema.find();
};

const getById = async (id) => {
  return await ContactSchema.findById(id);
};

const create = async ({ name, email, phone, favorite }) => {
  return await ContactSchema.create({ name, email, phone, favorite });
};

const update = async (id, fields) => {
  return await ContactSchema.findByIdAndUpdate({ _id: id }, fields, {
    new: true,
  });
};

const remove = async (id) => {
  return await ContactSchema.findByIdAndRemove({ _id: id });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  //  updateStatus,
};
