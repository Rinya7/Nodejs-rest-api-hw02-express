const jwt = require("jsonwebtoken");
const { SECRET } = process.env;
const UserSchema = require("../service/schemas/userSchema");
const HttpError = require("../service/helpers/httpError");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET);

    const user = await UserSchema.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401));
    }
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
