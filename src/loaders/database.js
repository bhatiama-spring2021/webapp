const config = require("../config/config");

const db = {};

let configDB = config.DB;

if (process.env.NODE_ENV === "test") {
  configDB = config.TESTDB;
}

const Sequelize = require("sequelize");
const sequelize = new Sequelize(configDB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

// Authenticate connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user")(sequelize, Sequelize);
db.book = require("../models/book")(sequelize, Sequelize);

module.exports = db;