// Create Database if does not exist
const mysql = require("mysql2/promise");
const config = require("../config/config");

module.exports = mysql
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
    connection.end();
  })
  .catch((err) => {
    console.error("Unable to create database:", err);
  });
