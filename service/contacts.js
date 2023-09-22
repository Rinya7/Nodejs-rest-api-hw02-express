const ContactSchema = require("./schemas/contactSchema");

//const getAll = async (data) => {
//  return await ContactSchema.find(data);
//};

const getById = async (id) => {
  return await ContactSchema.findById(id);
};

const create = async (data) => {
  return await ContactSchema.create(data);
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
  //  getAll,
  getById,
  create,
  update,
  remove,
};
