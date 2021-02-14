const { verifyUser, basicAuth, verifyRequest, verifyBook } = require("../validators");
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

  app.put(
    "/v1/user/self",
    [
      verifyRequest.checkEmptyRequestBody,
      basicAuth.BasicAuth,
      verifyUser.checkEmailUpdate,
      verifyUser.checkUpdateFields
    ],
    userService.updateUser
  );

  app.get(
    "/v1/user/self",
    [basicAuth.BasicAuth],
    userService.getUserInformation
  );

  app.post(
    "/books",
    [
      verifyRequest.checkEmptyRequestBody,
      basicAuth.BasicAuth,
      verifyBook.checkEmptyValues,
      verifyBook.checkDuplicateISBN
    ],
    bookService.createBook
  );

  app.get(
    "/books/:id",
    [basicAuth.BasicAuth],
    bookService.getBookById
  );

  app.delete(
    "/books/:id",
    [basicAuth.BasicAuth],
    bookService.deleteBookById
  );
};
