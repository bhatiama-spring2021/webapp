const { verifyUser, basicAuth } = require("../validators");
const userService = require("../services/user.service");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.put(
    "/v1/user/self",
    [
      verifyUser.checkEmptyRequestBody,
      basicAuth.BasicAuth,
      verifyUser.checkEmailUpdate,
      verifyUser.checkPassword,
    ],
    userService.updateUser
  );

  app.get(
    "/v1/user/self",
    [basicAuth.BasicAuth],
    userService.getUserInformation
  );
};
