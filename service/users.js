const bcrypt = require("bcrypt");
const UserSchema = require("./schemas/userSchema");

const reg = async (data) => {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return await UserSchema.create({ ...data, password: passwordHash });
};

const getById = async (id) => {
  return await UserSchema.findById(id);
};

const log = async (data) => {
  return await UserSchema.findOne({ email: data.email });
};

module.exports = {
  reg,
  log,
  getById,
};
