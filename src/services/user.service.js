const db = require("../loaders/database");
const User = db.user;
var bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
var SDC = require('statsd-client');
Metrics = new SDC({port: 8125});
const log = require("../../logs");
const logger = log.getLogger('logs');

// Create new User
exports.createUser = (req, res) => {
  Metrics.increment('user.POST.createUser');
  logger.info("create user api call");
  let timer = new Date();
  let db_timer = new Date();

  User.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  })
    .then((user) => {
      Metrics.timing('user.POST.dBcreateUser',db_timer);
      res.status(201).send({
        id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        account_created: user.account_created,
        account_updated: user.account_updated,
      });

      Metrics.timing('user.POST.createUser',timer);
    })
    .catch((err) => {
      logger.error("User not created: " + err.message);
      res.status(400).send({ message: err.message });
    });
};

// Update User Infomation
exports.updateUser = (req, res) => {
  Metrics.increment('user.PUT.updateUser');
  logger.info("update user api call");
  let timer = new Date();

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
  let db_timer = new Date();
  User.update(updateFields, {
    where: {
      username: req.user.username,
    },
  })
    .then(() => {
      Metrics.timing('user.PUT.dBupdateUser',db_timer);
      res.status(204).send();
      Metrics.timing('user.PUT.updateUser',timer);
    })
    .catch((err) => {
      logger.error("Unable to update user: " + err.message);
      res.status(400).send({ message: err.message });
    });
};

// Get User Information by authentication
exports.getUserInformation = (req, res) => {
  Metrics.increment('user.GET.getUserInformation');
  logger.info("Get user api call");
  let timer = new Date();

  let db_timer = new Date();
  User.findOne({
    where: {
      username: req.user.username,
    },
  })
    .then((user) => {
      Metrics.timing('user.GET.dBgetUserInformation',db_timer);
      if (!user) {
        logger.error("User not found");
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
      Metrics.timing('user.GET.getUserInformation',timer);
    })
    .catch((err) => {
      logger.error("Error finding the user: " + err.message);
      res.status(400).send({ message: err.message });
    });
};
