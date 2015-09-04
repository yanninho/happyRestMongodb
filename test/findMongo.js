var express = require('express'),
    request = require('supertest'),
    happyRestMongo = require('../index'),
    should = require('chai').should(),
    app = express(),
    mongoClient = require('mongodb').MongoClient;

app.use(function(req, res, next){
  mongoClient.connect('mongodb://localhost/happyRestMongo', function(err, db) {
      if(err) throw err;
      req.db = db;
      console.log('Connection mongoDB OK');
      next();
  });
});

happyRestMongo.findMongo(app, '/user', 'user', 200, 'users');

app.use(function(req,res,next) {
  res.end(JSON.stringify(req.result));
});

describe('find with mongoose', function(){
    it('should request users', function(done){
      request(app)
      .get('/user?fields=age,name,gender&eyeColor=blue&sort=age&desc=age&range=5-9')
      .end(function(err, res) {
        var users = res.body;
        var headers = res.headers;
        users.should.have.length(5);
        headers['accept-range'].should.equal('user 200');
        headers['content-range'].should.equal('5-9/18');
        headers['link'].should.equal('0-4;rel=first,0-4;rel=prev,10-14;rel=next,13-17;rel=last'); 
        done();
      });
    });
});
