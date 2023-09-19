const UserSchema = require("./schemas/userSchema");

const create = ({ password, email }) => {
  return UserSchema.create({ password, email });
};

const login = ({ email, password }) => {
  return UserSchema.findOne({ email, password });
};

module.exports = {
  create,
  login,
};
