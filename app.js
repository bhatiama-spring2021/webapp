const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const createDB = require("./src/loaders/create.db");

const app = express();
const PORT = process.env.PORT || 8081;

var corsOptions = {
  origin: "http://localhost:8081",
};

if (process.env.NODE_ENV === 'test') {
  console.log = function () {};
}

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Sync Database
createDB.then(() => {
  const db = require("./src/loaders/database");
  db.sequelize
    .sync({ force: true })
    .then(() => {
      console.log("Model synced");
      // set port, listen for requests
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
        // set routes
        require("./src/routes/auth.routes")(app);
        require("./src/routes/user.routes")(app);

        app.emit("serverStarted");
      });
    })
    .catch((err) => {
      err;
    });
});

module.exports = app;
