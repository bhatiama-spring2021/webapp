const Book = require("../loaders/database").book;

checkEmptyValues = (req, res, next) => {
  const errorMessages = {};
  if (!req.body.title || req.body.title === "") {
    errorMessages["titleError"] = "Title cannot be blank";
  }
  if (!req.body.author || req.body.author === "") {
    errorMessages["authorError"] = "Author cannot be blank";
  }
  if (!req.body.isbn || req.body.isbn === "") {
    errorMessages["isbnError"] = "ISBN cannot be blank";
  }
  if (!req.body.published_date || req.body.published_date === "") {
    errorMessages["publishedDateError"] = "Published date cannot be blank";
  }
  if (Object.keys(errorMessages).length != 0) {
    return res.status(400).send(errorMessages);
  }
  next();
};

/**
 * Same user cannot create a new book record with same ISBN, but 
 * a different user can create a new book record with a that same ISBN
 */

checkDuplicateISBN = (req, res, next) => {
  Book.findOne({
    where: {
      isbn: req.body.isbn,
      user_id: req.user.user_id
    },
  }).then((book) => {
    if (book) {
      res.status(400).send({
        message: "Duplicate ISBN! Cannot add new book",
      });
      return;
    }
    next();
  });
};

const verifyBook = {
  checkEmptyValues: checkEmptyValues,
  checkDuplicateISBN: checkDuplicateISBN,
};

module.exports = verifyBook;
