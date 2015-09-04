var express = require('express'),
    request = require('supertest'),
    happyRestMongoose = require('../index'),
    Usermodel = require('./user.model'),
    mongoose = require('mongoose'),
    should = require('chai').should(),
    app = express();

app.use(function(req, res, next){
  mongoose.connect('mongodb://localhost/happyRestMongo');
  var connection = mongoose.connection;
  connection.on('error', console.error.bind(console, 'connection MongoDB error:'));
  connection.once('open', function callback () {
    console.log('Connection mongoDB OK');
      next();
  }); 
});

happyRestMongoose.findMongoose(app, '/user', 'user', 200, Usermodel);
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
