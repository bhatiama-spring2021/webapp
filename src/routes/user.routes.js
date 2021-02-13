const { verifyUser, basicAuth } = require("../validators");
const userService = require("../services/user.service");
const bookService = require("../services/book.service");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/v1/user",
    [
    verifyUser.checkEmptyRequestBody,
    verifyUser.checkDuplicateEmail, 
    verifyUser.checkPassword
    ],
    userService.createUser
  );

  app.get(
    "/books", bookService.getAllBooks
  );
};
