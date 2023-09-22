const jwt = require("jsonwebtoken");
const { getById } = require("../service/users");
const { SECRET } = process.env;
const HttpError = require("../service/helpers/HttpError");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET);

    const user = await getById(id);
    if (!user) {
      next(HttpError(401));
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
