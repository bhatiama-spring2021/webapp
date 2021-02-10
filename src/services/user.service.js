const db = require("../loaders/database");
const User = db.user;
var bcrypt = require("bcryptjs");

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
        account_created: user.createdAt,
        account_updated: user.updatedAt,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// Update User Infomation
exports.updateUser = (req, res) => {
  User.update(
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: bcrypt.hashSync(req.body.password, 8),
    },
    {
      where: {
        username: req.user.username,
      },
    }
  )
    .then(() => {
      User.findOne({
        where: {
          username: req.user.username,
        },
      }).then((user) => {
        res.send({
          username: user.username,
          firstname: user.first_name,
          last_name: user.last_name,
        });
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

// Get User Information by authentication
exports.getUserByUsername = (req, res) => {
  User.findOne({
    where: {
      username: req.user.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found in the database" });
      }
      res.status(200).send({
        id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        account_created: user.createdAt,
        account_updated: user.updatedAt
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

// Get User Information by user_id
exports.getUserById = (req, res) => {
  User.findByPk(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      res.status(200).send({
        id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        account_created: user.createdAt,
        account_updated: user.updatedAt,
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};
