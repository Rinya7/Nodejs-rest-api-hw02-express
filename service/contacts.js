const ContactSchema = require("./schemas/contactSchema");

const getAll = async () => {
  return ContactSchema.find();
};

const getById = (id) => {
  return ContactSchema.findById(id);
};

const create = ({ name, email, phone, favorite }) => {
  return ContactSchema.create({ name, email, phone, favorite });
};

const update = (id, fields) => {
  return ContactSchema.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const remove = (id) => {
  return ContactSchema.findByIdAndRemove({ _id: id });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  //  updateStatus,
};
