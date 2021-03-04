const upload = require("../config/multer.config");
const db = require("../loaders/database");
const File = db.file;
const Book = db.book;
const { v4: uuidv4 } = require("uuid");
const s3 = require("../config/s3.config");
const { text } = require("body-parser");

const uploadParams = s3.uploadParams;
const deleteParams = s3.deleteParams;

exports.uploadImage = (req, res) => {
  const file_response = [];
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).send({
        message: "Error uploading file",
      });
    } else {
      let images = [];
      for (let image of req.files) {
        const UUID = uuidv4();
        if (!image.originalname.match(/\.(jpg|jpeg|png)$/i)) {
          return res
            .status(400)
            .send("Files with (.jpg, .jpeg, .png) format supported");
        } else {
          File.create({
            file_name: image.originalname,
            s3_object_name: UUID + "/" + image.originalname,
            user_id: req.user.user_id,
            book_id: req.params.book_id,
          })
            .then((file) => {
              Book.findByPk(file.book_id)
                .then((book) => {
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
                      uploadParams.Key = file.s3_object_name;
                      uploadParams.Body = image.buffer;
                      s3.s3Client.upload(uploadParams, (err) => {
                        if (err) {
                          return res.status(400).send({
                            message: "Unable to upload image to s3",
                          });
                        }
                      });
                      file_response.push({
                        file_name: file.file_name,
                        s3_object_name: file.s3_object_name,
                        file_id: file.file_id,
                        created_date: file.created_date,
                        user_id: file.user_id,
                      });
                      if (file_response.length == req.files.length) {
                        res.status(201).send(file_response);
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
  File.findByPk(req.params.image_id).then((file) => {
    if (!file) {
      return res.status(404).send({
        message: "Cannot delete! Image does not exist!",
      });
    }
    deleteParams.Key = file.s3_object_name;
    s3.s3Client.deleteObject(deleteParams, (err) => {
      if (err) {
        return res.status(400).send({
          message: "Unable to delete image from s3" + err,
        });
      } else {
        File.destroy({
          where: {
            file_id: req.params.image_id,
          },
        }).then(() => {
          Book.findByPk(req.params.book_id)
            .then((book) => {
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
                res.status(204).send();
              });
            })
            .catch((err) => {
              res.status(400).send({ message: err.message });
            });
        });
      }
    });
  });
};
