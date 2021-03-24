const upload = require("../config/multer.config");
const db = require("../loaders/database");
const File = db.file;
const Book = db.book;
const { v4: uuidv4 } = require("uuid");
const s3 = require("../config/s3.config");
const { text } = require("body-parser");
var SDC = require('statsd-client');
Metrics = new SDC({port: 8125});
const log = require("../../logs");
const logger = log.getLogger('logs');

const uploadParams = s3.uploadParams;
const deleteParams = s3.deleteParams;

exports.uploadImage = (req, res) => {
  Metrics.increment('file.POST.uploadImage');
  logger.info("upload image api call");
  let timer = new Date();

  const file_response = [];
  upload(req, res, (err) => {
    if (err) {
      logger.error("Error Uploading file: " + err);
      return res.status(400).send({
        message: "Error uploading file",
      });
    } else {
      let images = [];
      for (let image of req.files) {
        const UUID = uuidv4();
        if (!image.originalname.match(/\.(jpg|jpeg|png)$/i)) {
          logger.error("Unsupported image format");
          return res
            .status(400)
            .send("Files with (.jpg, .jpeg, .png) format supported");
        } else {
          let db_timer_file = new Date();
          File.create({
            file_name: image.originalname,
            s3_object_name: UUID + "/" + image.originalname,
            user_id: req.user.user_id,
            book_id: req.params.book_id,
          })
            .then((file) => {
              Metrics.timing('file.POST.dBCreateFileRecord',db_timer_file);
              let db_timer_book = new Date();
              Book.findByPk(file.book_id)
                .then((book) => {
                  Metrics.timing('file.POST.dBFindBook',db_timer_book);
                  if (book.book_images == null) {
                    images.push(file.get({ json: text }));
                  } else {
                    images = book.book_images;
                    images.push(file.get({ json: text }));
                  }
                  Book.update(
                    {
                      book_images: images,
                    },
                    {
                      where: {
                        book_id: file.book_id,
                      },
                    }
                  )
                    .then(() => {
                      Metrics.timing('file.POST.dBUpdateBook',db_timer_book);
                      uploadParams.Key = file.s3_object_name;
                      uploadParams.Body = image.buffer;
                      let s3_timer = new Date();
                      s3.s3Client.upload(uploadParams, (err) => {
                        if (err) {
                          logger.error("Unable to upload image to s3: " + err);
                          return res.status(400).send({
                            message: "Unable to upload image to s3",
                          });
                        }
                      });
                      Metrics.timing('file.POST.s3UloadImageToS3',s3_timer);
                      file_response.push({
                        file_name: file.file_name,
                        s3_object_name: file.s3_object_name,
                        file_id: file.file_id,
                        created_date: file.created_date,
                        user_id: file.user_id,
                      });
                      if (file_response.length == req.files.length) {
                        res.status(201).send(file_response);
                        Metrics.timing('file.POST.uploadImage',timer);
                      }
                    })
                    .catch((err) => {
                      res.status(400).send({ message: err.message });
                    });
                })
                .catch((err) => {
                  res.status(400).send({ message: err.message });
                });
            })
            .catch((err) => {
              res.status(400).send({ message: err.message });
            });
        }
      }
    }
  });
};

exports.deleteImage = (req, res) => {
  Metrics.increment('file.DELETE.deleteImage');
  logger.info("delete image api call");
  let timer = new Date();

  let db_timer_file = new Date();

  File.findByPk(req.params.image_id).then((file) => {
    Metrics.timing('file.DELETE.deleteImage',db_timer_file);
    if (!file) {
      logger.error("Cannot delete! Image does not exist");
      return res.status(404).send({
        message: "Cannot delete! Image does not exist!",
      });
    }
    deleteParams.Key = file.s3_object_name;
    let s3_timer = new Date();
    s3.s3Client.deleteObject(deleteParams, (err) => {
      Metrics.timing('file.DELETE.s3deleteImage',s3_timer);
      if (err) {
        logger.error("Unable to delete image from s3 " + err);
        return res.status(400).send({
          message: "Unable to delete image from s3" + err,
        });
      } else {
        let db_timer = new Date();
        File.destroy({
          where: {
            file_id: req.params.image_id,
          },
        }).then(() => {
          Metrics.timing('file.DELETE.dBdeleteImage',db_timer);
          Book.findByPk(req.params.book_id)
            .then((book) => {
              Metrics.timing('file.DELETE.dBfindBook',db_timer);
              const images = book.book_images.filter(
                (image) => image.file_id != req.params.image_id
              );
              Book.update(
                {
                  book_images: images,
                },
                {
                  where: {
                    book_id: req.params.book_id,
                  },
                }
              ).then(() => {
                Metrics.timing('file.DELETE.dBupdateBook',db_timer);
                res.status(204).send();

                Metrics.timing('file.DELETE.deleteImage',timer);
              });
            })
            .catch((err) => {
              logger.error("Error deleting the book: " + err.message);
              res.status(400).send({ message: err.message });
            });
        });
      }
    });
  });
};
