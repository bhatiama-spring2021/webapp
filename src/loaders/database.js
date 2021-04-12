const config = require("../config/db.config");
const { QueryTypes } = require("sequelize");
const log = require("../../logs");
const logger = log.getLogger("logs");

const db = {};

let configDB = config.DB;

if (process.env.NODE_ENV === "test") {
  configDB = config.TESTDB;
}

const Sequelize = require("sequelize");
const sequelize = new Sequelize(configDB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  dialectOptions: {
    ssl: "Amazon RDS",
    rejectUnauthorized: true,
  },
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

// check and log the validation result for RDS SSL connection type
sequelize
  .query(
    "SELECT id, user, host, connection_type FROM performance_schema.threads pst INNER JOIN information_schema.processlist isp ON pst.processlist_id = isp.id",
    {
      type: QueryTypes.SELECT,
    }
  )
  .then((query_res) => {
    if (query_res == undefined || query_res == null || query_res.length == 0) {
      logger.info(
        "RDS DB SSL connection type result of query : SELECT id, user, host, connection_type FROM performance_schema.threads pst INNER JOIN information_schema.processlist isp ON pst.processlist_id = isp.id ; Result : SSL data not available"
      );
    } else {
      logger.info(
        " RDS DB SSL connection type result of query : SELECT id, user, host, connection_type FROM performance_schema.threads pst INNER JOIN information_schema.processlist isp ON pst.processlist_id = isp.id ; Result :"
      );
      logger.info(JSON.stringify(query_res));
    }
  })
  .catch(err => {
    logger.error("Error running sequelize Query: " + err);
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
db.file = require("../models/file")(sequelize, Sequelize);

module.exports = db;
