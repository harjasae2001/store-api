// import {authMiddleware} from "../middleware/is-auth";
const e = require("express");
const authMiddleware = require("../middleware/is-auth");
const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");
describe("Auth Middleware", function () {
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get: function () {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: function () {
        return "xyz";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the token cannot be verified", () => {
    const req = {
      get: function () {
        return "Bearer xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield a userId after decoding the token", () => {
    const req = {
      get: function () {
        return "Bearer xyz";
      },
    };
    sinon.stub(jwt, "verify");
    // Monkey patching jwt.verify to return a dummy object so that we can test the userId
    // jwt.verify = function () {
    //   return { userId: "abc" };
    // };
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    // reset the function for future tests
    jwt.verify.restore();
  });
});
