const db = require("../loaders/database");
const User = db.user;

const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;

checkDuplicateEmail = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Cannot Create account! Email is already in use!",
      });
      return;
    }
    next();
  });
};

checkPassword = (req, res, next) => {
  if (!regex.test(req.body.password)) {
    return res.status(400).send({
      message: "Password is too weak! Please make sure password has uppercase letters, lowercase letters, numbers, and special characters.",
    });
  }
  next();
};

checkEmailUpdate = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (req.body.username != req.user.username) {
      res.status(400).send({
        message: "Username cannot be updated",
      });
      return;
    }
    next();
  });
};

const verifyUser = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkPassword: checkPassword,
  checkEmailUpdate: checkEmailUpdate,
};

module.exports = verifyUser;
