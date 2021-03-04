const basicAuth = require("./basicAuth");
const verifyUser = require("./verifyUser");
const verifyRequest = require("./verifyRequest");
const verifyBook = require("./verifyBook");
const verifyFile = require("./verifyFile");

module.exports = {
    basicAuth,
    verifyUser,
    verifyRequest,
    verifyBook,
    verifyFile
};