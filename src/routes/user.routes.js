const { verifyUser, verifyRequest, verifyBook } = require("../validators");
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
    verifyRequest.checkEmptyRequestBody,
    verifyUser.checkDuplicateEmail, 
    verifyUser.checkPassword,
    verifyUser.checkFirstName,
    verifyUser.checkLastName
    ],
    userService.createUser
  );

  app.get(
    "/books/:id",
    bookService.getBookById
  );

  app.get(
    "/books", bookService.getAllBooks
  );

  app.get("/healthstatus", (req, res) => {
    res.status(200).send({status: "Webapp Healthy"});
  });
};
