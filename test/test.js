const app = require("../app");
const chai = require("chai");
const request = require("supertest");
const should = chai.should();
const nock = require("nock");

const testUser = {
  username: "test@gmail.com",
  password: "Test@1234",
};

// Test auth /GET route
describe("Test GET /v1/user/self", function () {
  it("should return status 200", function (done) {
    nock("http://localhost:8080")
      .get("/v1/user/self")
      .reply(200, { message: "success" });

    request(app)
      .get("/v1/user/self")
      .auth(testUser.username, testUser.password, { type: "basic" })
      .end(function (err, res) {
        res.status.should.be.equal(200);
        done();
      });
  });
});
