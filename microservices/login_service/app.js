var express = require('express');
var bodyParser = require('body-parser');

// Retrieve
var MongoClient = require('mongodb').MongoClient;

var app = express();
app.use(bodyParser.json());

// Connect to the db 
var connection_url = "CONNECTION_URL";
var url = "mongodb://"+ connection_url + "/test";
MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true} , function(err, mongoclient) {
  if(err) {
    console.log("Mongo DB connection failed");
    return console.dir(err);
  }
  console.log("Mongo DB connection successful");

  // Create and Initialize DB for Login - if not created already
  var database = mongoclient.db("test");
  database.createCollection('login', function(err1, collection) {
    var docs = [
      {_id: "user1", password: "user1"},
      {_id: "user2", password: "user2"},
      {_id: "user3", password: "user3"}
    ];
    var collection = database.collection('login');
    collection.insertMany(docs, {w:1}, function(err2, result) {
        if (!err2) {
          console.log("Docs inserted in Collection 'Login'.");
        }

        collection.find().toArray(function(err, items) {
          console.log("Records in Login DB : ", items);
          mongoclient.close();
        });
    });
  });
});

app.get('/login', function (req, res) {

  console.log("in GET - login");

  // check for basic auth header
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    return res.status(401).json({ message: 'Missing Authorization Header' });
  }

  // verify auth credentials
  var base64Credentials =  req.headers.authorization.split(' ')[1];
  var credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  var [username, password] = credentials.split(':');
  console.log("username : ", username);
  console.log("password : ", password);
  
  MongoClient.connect(url, {useNewUrlParser: true} , function(err, mongoclient) {
    if(err) {
      console.log("Mongo DB connection failed");
      return console.dir(err);
    }
    console.log("Mongo DB connection successful");
    var database = mongoclient.db("test");

    var collection = database.collection('login');

    collection.find({_id:username}).toArray(function(err, items) {
        console.log("in GET - User details : ", items);

        if (err) {
          console.log("User not Found");
          res.send(err);
        } else {
          var credentials = items[0];
          if (credentials.password == password){
            var resp = {responseCode: 0, message: "Credentials Matched"};
            console.log(JSON.stringify(resp));
            mongoclient.close();
            res.status(200).send(resp);
          } else {
            var resp = {responseCode: 1, message: "Incorrect Credentials"};
            console.log(JSON.stringify(resp));
            mongoclient.close();
            res.status(401).send(resp);
          }
        }
    });
  });
});

app.get('/', function (req, res) {
    res.end( "Rest API implementation for LOGIN SERVICE" );
});

var port = 8080;

var server = app.listen(port, function () {
  console.log("Login service listening on " + port);
});
