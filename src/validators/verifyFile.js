const db = require("../loaders/database");
const Book = db.book;
const log = require("../../logs");
const logger = log.getLogger('logs');

checkBookOwnership = (req, res, next) => {
  Book.findByPk(req.params.book_id)
    .then((book) => {
      if (!book) {
        logger.error("404: Book not found error");
        return res
          .status(404)
          .send({ message: "No Book found with the given ID" });
      } else if (book.user_id != req.user.user_id) {
        logger.error("401: Unauthorized User error");
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
