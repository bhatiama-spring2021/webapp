const config = require("../config/config");
const mysql = require("mysql2/promise");

module.exports = db = {};

const initialize = async () => {
  mysql
  .createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
  })
  .then((connection) => {
    connection
      .query(`CREATE DATABASE IF NOT EXISTS \`${config.DB}\`;`)
      .then((res) => {
        console.info(`Database ${config.DB}\ created`);
      });
  })
  .catch((err) => {
    console.error("Unable to create connection:", err);
  });

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
});

// Sync database
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Resync the Database and if already exists Drop the database");
  })
  .catch((err) => {
    err;
  });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user")(sequelize, Sequelize);

}

initialize();