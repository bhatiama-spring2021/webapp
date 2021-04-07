const db = require("../loaders/database");
var AWS = require('aws-sdk');
const User = db.user;
const Book = db.book;
const File = db.file;
const s3 = require("../config/s3.config");
const deleteParams = s3.deleteParams;
var SDC = require('statsd-client');
Metrics = new SDC({port: 8125});
const log = require("../../logs");
const logger = log.getLogger('logs');
var book_title = "";

// Create new book
exports.createBook = (req, res) => {
  Metrics.increment('book.POST.createBook');
  logger.info("create book api call");
  let timer = new Date();

  let db_timer = new Date();
  User.findOne({
    where: {
      username: req.user.username,
    },
  }).then((user) => {
    Metrics.timing('book.POST.dBfindUser',db_timer);
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
          Metrics.timing('book.POST.dBcreateBook',db_timer);

          AWS.config.update({
            region: process.env.REGION
          });

          var params = {
            MessageStructure: 'json',
            Message: JSON.stringify({
              "default": JSON.stringify({
                "dynamo_tablename": process.env.DYNAMO_DB_TABLE,
                "api_url": process.env.PROFILE_AWS +"."+process.env.NAME_DOMAIN,
                "email_check_flag": "Book_Created",
                "book_id": book.book_id,
                "book_title": book.title,
                "username": req.user.username
              }),
            }),
            TopicArn: process.env.SNS_TOPIC_ARN
          };

          var publishTextPromise = new AWS.SNS({
            apiVersion: '2010-03-31'
          }).publish(params).promise();

          publishTextPromise.then((data) => {
            logger.info(`Message ${params.Message} published to the topic ${params.TopicArn}`);
            res.send("Success");
          });

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
          logger.error("book not created: " + err.message);
          res.status(400).send({ message: err.message });
        });
    }
  });
};

// Get book by ID
exports.getBookById = (req, res) => {
  Metrics.increment('book.GET.getBookById');
  logger.info("Get book by ID api call");
  let timer = new Date();

  let db_timer = new Date();
  Book.findByPk(req.params.id)
    .then((book) => {
      Metrics.timing('book.POST.dBgetBookById',db_timer);
      if (!book) {
        logger.error("No book found with the given ID");
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
      Metrics.timing('book.POST.getBookById',timer);
    })
    .catch((err) => {
      logger.error("Error finding the book: " + err.message);
      res.status(400).send({ message: err.message });
    });
};

// Delete book by ID
exports.deleteBookById = (req, res) => {
  Metrics.increment('book.DELETE.deleteBookById');
  logger.info("Delete book by ID api call");
  let timer = new Date();
  let db_timer = new Date();
  Book.findByPk(req.params.id).then((book) => {
    Metrics.timing('book.DELETE.dBfindBookByPk',db_timer);
    if (!book) {
      logger.error("Cannot delete! No Book found with the given ID");
      return res
        .status(404)
        .send({ message: "Cannot delete! No Book found with the given ID" });
    } else if (book.user_id != req.user.user_id) {
      logger.error("Cannot delete! Unauthorized User.");
      return res
        .status(401)
        .send({ message: "Cannot delete! Unauthorized User." });
    } else {
      let db_timer_file = new Date();
      File.findAll({
        raw: true,
        where: {
          book_id: req.params.id,
        },
      }).then((files) => {
        Metrics.timing('book.DELETE.dBfindAllFiles',db_timer_file);
        let s3_timer = new Date();
        for (let file of files) {
          deleteParams.Key = file.s3_object_name;
          s3.s3Client.deleteObject(deleteParams, (err) => {
            if (err) {
              logger.error("Unable to delete image from s3: "+ err);
              return res.status(400).send({
                message: "Unable to delete image from s3" + err,
              });
            }
          });
        }
        book_title = book.title;
        Metrics.timing('book.DELETE.s3deleteAllFiles',s3_timer);
        let db_timer = new Date();
        Book.destroy({
          where: {
            book_id: req.params.id,
            user_id: req.user.user_id,
          },
        })
          .then(() => {
            Metrics.timing('book.DELETE.dBdeleteBookById',db_timer);

            AWS.config.update({
              region: process.env.REGION
            });
  
            var params = {
              MessageStructure: 'json',
              Message: JSON.stringify({
                "default": JSON.stringify({
                  "dynamo_tablename": process.env.DYNAMO_DB_TABLE,
                  "api_url": process.env.PROFILE_AWS +"."+process.env.NAME_DOMAIN,
                  "email_check_flag": "Book_Deleted",
                  "book_id": req.params.id,
                  "book_title": book_title,
                  "username": req.user.username
                }),
              }),
              TopicArn: process.env.SNS_TOPIC_ARN
            };
  
            var publishTextPromise = new AWS.SNS({
              apiVersion: '2010-03-31'
            }).publish(params).promise();
  
            publishTextPromise.then((data) => {
              logger.info(`Message ${params.Message} published to the topic ${params.TopicArn}`);
              res.send("Success");
            });

            res.status(204).send();
            Metrics.timing('book.DELETE.deleteBookById',timer);
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
  Metrics.increment('book.GET.getAllBooks');
  logger.info("Get all books api call");
  let timer = new Date();
  let db_timer = new Date();
  Book.findAll({ raw: true })
    .then((book) => {
      Metrics.timing('book.GET.dBfindAllBooks',db_timer);
      if (!book) {
        logger.error("No books available");
        return res.status(404).send({ message: "No books available" });
      }
      res.status(200).send(book);
      Metrics.timing('book.GET.getAllBooks',timer);
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};
