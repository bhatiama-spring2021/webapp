const Book = require("../loaders/database").book;
const log = require("../../logs");
const logger = log.getLogger('logs');

const isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
const dateRegex = /^(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s?\d{0,2},\s+\d{4}/

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
    logger.error("400: " + errorMessages);
    return res.status(400).send(errorMessages);
  }
  next();
};

/**
 * Same user cannot create a new book record with same ISBN, but 
 * a different user can create a new book record with a that same ISBN
 */

checkISBN = (req, res, next) => {
  Book.findOne({
    where: {
      isbn: req.body.isbn,
      user_id: req.user.user_id
    },
  }).then((book) => {
    if (book) {
      logger.error("400: Duplicate ISBN error");
      return res.status(400).send({
        message: "Duplicate ISBN! Cannot add new book",
      });
    }
    else if(!isbnRegex.test(req.body.isbn)) {
      logger.error("400: Invalid ISBN error");
      return res.status(400).send({
        message: "Invalid ISBN format! ISBN should a be 10 or 13 digits",
      });
    }
    next();
  });
};

checkPublishedDate = (req, res, next) => {
    if(!dateRegex.test(req.body.published_date)) {
      logger.error("400: Invalid Published date error");
      return res.status(400).send({
        message: "Published date should be in format: 'Month, Year' or 'Month Date, Year'"
      });
    }
    next();
};

const verifyBook = {
  checkEmptyValues: checkEmptyValues,
  checkISBN: checkISBN,
  checkPublishedDate: checkPublishedDate
};

module.exports = verifyBook;
