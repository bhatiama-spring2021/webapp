const db = require("../loaders/database");
const User = db.user;
const Book = db.book;

// Create new book
exports.createBook = (req, res) => {
  User.findOne({
    where: {
      username: req.user.username,
    },
  }).then((user) => {
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found in the database" });
    } else {
      Book.create({
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        published_date: req.body.published_date,
        user_id: user.user_id,
      })
        .then((book) => {
          res.status(201).send({
            id: book.book_id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            published_date: book.published_date,
            book_created: book.book_created,
            user_id: book.user_id,
          });
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
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

// Delete book by ID
exports.deleteBookById = (req, res) => {
  Book.findByPk(req.params.id)
    .then((book) => {
      if (!book) {
        return res
          .status(404)
          .send({ message: "Cannot delete! No Book found with the given ID" });
      } else if (book.user_id != req.user.user_id) {
        return res
          .status(401)
          .send({ message: "Cannot delete! Unauthorized User." });
      }
      else {
        Book.destroy({
            where: {
                book_id: req.params.id,
                user_id: req.user.user_id
            }
        })
        .then(()=>{
            res.status(204).send();
        })
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

// Get all books
exports.getAllBooks = (req, res) => {
    Book.findAll({raw: true})
      .then((book) => {
        if (!book) {
          return res
            .status(404)
            .send({ message: "No books available" });
        }
        res.status(200).send(book);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  };


