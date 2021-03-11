const app = require("../app");
const chai = require("chai");
const should = chai.should();
const httpMocks = require('node-mocks-http');
const { verifyUser } = require("../src/validators");

const request = httpMocks.createRequest({
  body: {
  password: "test1234",
  }
});

let response = httpMocks.createResponse();

describe("Test password: test1234", function () {
  it("should return status 400 & message: Password too weak!", function(done) {
    const next = function() {done();}
    verifyUser.checkPassword(request, response, next);
    const message = response._getData().message;
    const expectedMessage = "Password is too weak!"
    message.should.include(expectedMessage);
    response.statusCode.should.be.equal(400);
    done();
  });
});
