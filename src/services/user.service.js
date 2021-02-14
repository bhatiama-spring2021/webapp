const db = require("../loaders/database");
const User = db.user;
var bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// Create new User
exports.createUser = (req, res) => {
  User.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  })
    .then((user) => {
      res.status(201).send({
        id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        account_created: user.account_created,
        account_updated: user.account_updated,
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

// Update User Infomation
exports.updateUser = (req, res) => {
  const updateFields = {};
  if (req.body.first_name) {
    updateFields["first_name"] = req.body.first_name;
  }
  if (req.body.last_name) {
    updateFields["last_name"] = req.body.last_name;
  }
  if (req.body.password) {
    updateFields["password"] = bcrypt.hashSync(req.body.password, 8);
  }
  User.update(updateFields, {
    where: {
      username: req.user.username,
    },
  })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

// Get User Information by authentication
exports.getUserInformation = (req, res) => {
  User.findOne({
    where: {
      username: req.user.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "User not found in the database" });
      }
      res.status(200).send({
        id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        account_created: user.account_created,
        account_updated: user.account_updated,
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};
