const log = require("../../logs");
const logger = log.getLogger('logs');

checkEmptyRequestBody = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    logger.error("400: Invalid Request body error");
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
