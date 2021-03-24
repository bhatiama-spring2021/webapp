const db = require("../loaders/database");
var bcrypt = require("bcryptjs");
const User = db.user;
const log = require("../../logs");
const logger = log.getLogger('logs');

BasicAuth = (req, res, next) => {
  // check for basic auth header
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Basic ") === -1
  ) {
    logger.error("401: Missing Authorization error");
    return res.status(401).json({ message: "Missing Authorization Header" });
  }

  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");
  User.findOne({
    where: {
      username: username,
    },
  })
    .then((user) => {
      if (!user) {
        logger.error("401: Invalid Credentials error");
        return res.status(401).json({ message: "Invalid Credentials!!" });
      }
      var passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        logger.error("401: Incorrect Password error");
        return res.status(401).send({
          message: "Please check the Password!!",
        });
      }
      // attach user to request object
      req.user = user;
      next();
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const authentication = {
  BasicAuth: BasicAuth,
};

module.exports = authentication;
