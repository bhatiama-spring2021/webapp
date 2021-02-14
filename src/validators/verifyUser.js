const db = require("../loaders/database");
const User = db.user;

const passRegex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
const nameRegex = /^[a-z ,.'-]+$/i;

checkDuplicateEmail = (req, res, next) => {
  if (!req.body.username) {
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
  if (!req.body.password || req.body.password === "") {
    return res.status(400).send({
      message: "Password cannot be empty",
    });
  } else if (!passRegex.test(req.body.password)) {
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
    if (
      (req.body.username && req.body.username != req.user.username) ||
      req.body.username === ""
    ) {
      res.status(400).send({
        message: "Username cannot be updated",
      });
      return;
    }
    next();
  });
};

checkFirstName = (req, res, next) => {
  if (!req.body.first_name || req.body.first_name === "") {
    return res.status(400).send({
      message: "First Name cannot be empty",
    });
  } else if (!nameRegex.test(req.body.first_name)) {
    return res.status(400).send({
      message: "Invalid First Name",
    });
  }
  next();
};

checkLastName = (req, res, next) => {
  if (!req.body.last_name || req.body.last_name === "") {
    return res.status(400).send({
      message: "Last Name cannot be empty",
    });
  } else if (!nameRegex.test(req.body.last_name)) {
    return res.status(400).send({
      message: "Invalid Last Name",
    });
  }
  next();
};

checkUpdateFields = (req, res, next) => {
  if (req.body.password === "") {
    return res.status(400).send({
      message: "Password cannot be empty",
    });
  } else if (req.body.password && !passRegex.test(req.body.password)) {
    return res.status(400).send({
      message:
        "Password is too weak! Please make sure password has uppercase letters, lowercase letters, numbers, and special characters.",
    });
  }
  if (req.body.first_name === "") {
    return res.status(400).send({
      message: "First Name cannot be empty",
    });
  } else if (req.body.first_name && !nameRegex.test(req.body.first_name)) {
    return res.status(400).send({
      message: "Invalid First Name",
    });
  }
  if (req.body.last_name === "") {
    return res.status(400).send({
      message: "Last Name cannot be empty",
    });
  } else if (req.body.last_name && !nameRegex.test(req.body.last_name)) {
    return res.status(400).send({
      message: "Invalid Last Name",
    });
  }
  next();
};

const verifyUser = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkPassword: checkPassword,
  checkFirstName: checkFirstName,
  checkLastName: checkLastName,
  checkEmailUpdate: checkEmailUpdate,
  checkUpdateFields: checkUpdateFields
};

module.exports = verifyUser;
