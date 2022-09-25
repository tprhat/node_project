var expect = require('chai').expect;
var request = require('request');

describe('Home page', function () {
  it('status', function (done) {
    request('http://localhost:8080/', function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});


describe('Login page', function () {
  it('status', function (done) {
    request('http://localhost:8080/login', function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});

describe('Signup page', function () {
  it('status', function (done) {
    request('http://localhost:8080/signup', function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});



