const db = require("../loaders/database");
const Book = db.book;

checkBookOwnership = (req, res, next) => {
  Book.findByPk(req.params.book_id)
    .then((book) => {
      if (!book) {
        return res
          .status(404)
          .send({ message: "No Book found with the given ID" });
      } else if (book.user_id != req.user.user_id) {
        return res.status(401).send({ message: "Unauthorized User!" });
      }
      next();
    })
    .catch((res, err) => {
      res.status(400).send({
        message: err.message,
      });
    });
};

const verifyFile = {
  checkBookOwnership: checkBookOwnership,
};

module.exports = verifyFile;
