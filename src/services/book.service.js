const db = require("../loaders/database");
const User = db.user;
const Book = db.book;
const File = db.file;
const s3 = require("../config/s3.config");
const deleteParams = s3.deleteParams;
var SDC = require('statsd-client');
Metrics = new SDC({port: 8125});
const log = require("../../logs");
const logger = log.getLogger('logs');

// Create new book
exports.createBook = (req, res) => {
  Metrics.increment('book.POST.createBook');
  logger.info("create book");
  let timer = new Date();

  User.findOne({
    where: {
      username: req.user.username,
    },
  }).then((user) => {
    if (!user) {
      logger.error("user not found");
      return res
        .status(404)
        .send({ message: "User not found in the database" });
    } else {
      let db_timer = new Date(); 
      Book.create({
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        published_date: req.body.published_date,
        user_id: user.user_id,
      })
        .then((book) => {
          Metrics.timing('book.POST.dbcreateBook',db_timer);
          res.status(201).send({
            id: book.book_id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            published_date: book.published_date,
            book_created: book.book_created,
            user_id: book.user_id,
            book_images: book.book_images || [],
          });
          Metrics.timing('book.POST.createBook',timer);
        })
        .catch((err) => {
          res.status(400).send({ message: err.message });
        });
    }
  });
};

// Get book by ID
exports.getBookById = (req, res) => {
  Book.findByPk(req.params.id)
    .then((book) => {
      if (!book) {
        return res
          .status(404)
          .send({ message: "No Book found with the given ID" });
      }
      res.status(200).send({
        id: book.book_id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        published_date: book.published_date,
        book_created: book.book_created,
        user_id: book.user_id,
        book_images: book.book_images || [],
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

// Delete book by ID
exports.deleteBookById = (req, res) => {
  Book.findByPk(req.params.id).then((book) => {
    if (!book) {
      return res
        .status(404)
        .send({ message: "Cannot delete! No Book found with the given ID" });
    } else if (book.user_id != req.user.user_id) {
      return res
        .status(401)
        .send({ message: "Cannot delete! Unauthorized User." });
    } else {
      File.findAll({
        raw: true,
        where: {
          book_id: req.params.id,
        },
      }).then((files) => {
        for (let file of files) {
          deleteParams.Key = file.s3_object_name;
          s3.s3Client.deleteObject(deleteParams, (err) => {
            if (err) {
              return res.status(400).send({
                message: "Unable to delete image from s3" + err,
              });
            }
          });
        }
        Book.destroy({
          where: {
            book_id: req.params.id,
            user_id: req.user.user_id,
          },
        })
          .then(() => {
            res.status(204).send();
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      });
    }
  });
};

// Get all books
exports.getAllBooks = (req, res) => {
  Book.findAll({ raw: true })
    .then((book) => {
      if (!book) {
        return res.status(404).send({ message: "No books available" });
      }
      res.status(200).send(book);
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};
