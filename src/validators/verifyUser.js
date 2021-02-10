const db = require("../loaders/database");
const User = db.user;

const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/

checkDuplicateEmail = (req, res, next) => {

  if (!regex.test(req.body.password)) {
    return res.status(401).send({
      message: "Failed! Password is too weak"
    });
  }
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(401).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }
    next();
  });
};

checkPassword= (req, res, next) => {

  if (!regex.test(req.body.password)) {
    return res.status(401).send({
      message: "Failed! Password is too weak"
    });
  }
  next();
};

checkEmailUpdate = (req, res, next) => {
    User.findOne({
      where: {
        email_address: req.body.email_address
      }
    }).then(user => {
      if (req.body.email_address != req.user.email_address) {
        res.status(401).send({
          message: "Email cannot be updated"
        });
        return;
      }
      next();
    });
  };

const verifyUser = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkPassword: checkPassword,
  checkEmailUpdate: checkEmailUpdate
};

module.exports = verifyUser;