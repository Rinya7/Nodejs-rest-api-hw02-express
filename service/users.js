const bcrypt = require("bcrypt");
const UserSchema = require("./schemas/userSchema");

const reg = async (data) => {
  const passwordHash = await bcrypt.hash(data.password, 10);
  console.log("passwordHash", passwordHash);
  return await UserSchema.create({ ...data, password: passwordHash });
};

const log = ({ email, password }) => {
  return UserSchema.findOne({ email, password });
};

module.exports = {
  reg,
  log,
};
