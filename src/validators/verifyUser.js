const db = require("../loaders/database");
const User = db.user;

const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;

checkDuplicateEmail = (req, res, next) => {
  if(!req.body.username){
    return res.status(400).send({
      message: "Cannot Create account! Username cannot be blank",
    });
  }
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Cannot Create account! Username is already in use!",
      });
      return;
    }
    next();
  });
};

checkPassword = (req, res, next) => {
  if (!req.body.password) {
    return res.status(400).send({
      message: "Password cannot be empty",
    });
  } else if (!regex.test(req.body.password)) {
    return res.status(400).send({
      message:
        "Password is too weak! Please make sure password has uppercase letters, lowercase letters, numbers, and special characters.",
    });
  }
  next();
};

checkEmailUpdate = (req, res, next) => {
  User.findOne({
    where: {
      username: req.user.username,
    },
  }).then(() => {
    if ((req.body.username && (req.body.username != req.user.username)) || req.body.username === "") {
      res.status(400).send({
        message: "Username cannot be updated",
      });
      return;
    }
    next();
  });
};

checkEmptyRequestBody = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "Request body cannot be empty"
    });
  }
  next();
};

const verifyUser = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkPassword: checkPassword,
  checkEmailUpdate: checkEmailUpdate,
  checkEmptyRequestBody: checkEmptyRequestBody
};

module.exports = verifyUser;
