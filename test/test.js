const app = require("../app");
const db = require("../src/loaders/database");
const User = db.user;
const chai = require("chai");
const bcrypt = require("bcryptjs");
const { v1: uuidv1 } = require("uuid");
const request = require("supertest");
const should = chai.should();

const user = {
  username: "test@gmail.com",
  password: "test@1234",
  first_name: "Test",
  last_name: "User",
};

const mock_id = uuidv1();

describe("Test APIs", function () {
  before(function (done) {
    app.on("serverStarted", function () {
      //User.destroy({ truncate: true });
      user.password = bcrypt.hashSync(user.password, 8);
      User.create(user).then(function () {
        done();
      });
    });
  });

  // Test auth /GET route
  describe("GET /v1/user/self", function () {
    it("should return status 200", function (done) {
      request(app)
        .get("/v1/user/self")
        .auth(user.username, "test@1234", { type: "basic" })
        .end(function (err, res) {
          res.status.should.be.equal(200);
          done();
        });
    });
  });
});
