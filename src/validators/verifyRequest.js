checkEmptyRequestBody = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "Request body cannot be empty",
    });
  }
  next();
};

const verifyRequest = {
  checkEmptyRequestBody: checkEmptyRequestBody,
};

module.exports = verifyRequest;
