var express = require('express');
var bodyParser = require('body-parser');
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
  var database = mongoclient.db("test");

  database.createCollection('accountdetails', function(err1, collection) {
    var docs = [
      {_id: "121", accountholder: "John", funds: 25000},
      {_id: "122", accountholder: "Tim", funds: 15000},
      {_id: "123", accountholder: "Joseph", funds: 250000},
      {_id: "124", accountholder: "Mary", funds: 200000}
    ];
    collection.insertMany(docs, {w:1}, function(err2, result) {
      if (!err2) {
        console.log("Docs inserted in Collection 'accountdetails'.");
      }

      collection.find().toArray(function(err, items) {
        console.log("Collection(accountdetails) items : ", items);
      });
    });
  });

  database.createCollection('transactionlog', function(err3, collection) {
    var docs = [
      {_id:0, source_account:"000", debited_amount:0, target_account:"000", credited_amount:0, transfer_type:"test", remarks:"test", debit_transaction_code:0, credit_transaction_code:0}
    ];
    collection.insertMany(docs, {w:1}, function(err4, result) {
      if (!err4) {
        console.log("Docs inserted in Collection 'transactionlog'.");
      }

      collection.find().toArray(function(err4, items) {
        console.log("Collection(transactionlog) items : ", items);
      });
    });
  });
});


app.post('/check_accounts', function (req, res) {
  console.log("in Check Accounts -");
	var body = req.body;
	console.log(JSON.stringify(body));
  
  var minimum_balance = 1000;
  var source_account = body['source_accountID'];
  var amount_to_transfer = body['amount_to_transfer'];
  var target_account = body['target_accountID'];

  MongoClient.connect(url, {useNewUrlParser: true} , function(err, mongoclient) {
    if(err) {
      console.log("Mongo DB connection failed");
      return console.dir(err);
    }
    console.log("Mongo DB connection successful");
    var database = mongoclient.db("test");

    var collection = database.collection('accountdetails');
    // check whether target account exists
    collection.find({_id:target_account}).toArray(function(err1, account1){
      if (err1){
        console.log("Internal DB Server Error");
        var resp = {responseCode: 1, message: "Internal DB Server Error"};
        console.log(JSON.stringify(resp));
        mongoclient.close();
        res.send(resp);
      } else if (account1.length == 0 ){
        console.log("Target account does not exist");
        var resp = {responseCode: 1, message: "Target account does not exist"};
        console.log(JSON.stringify(resp));
        mongoclient.close();
        res.send(resp);
      } else {
        console.log("Target account exists - ", account1);

        //if target account exists then check source account exists with sufficient balance
        collection.find({_id:source_account}).toArray(function(err2, account2){
          if (err2){
            console.log("Internal DB Server Error");
            console.log(err2);
            var resp = {responseCode: 1, message: "Internal DB Server Error"};
            console.log(JSON.stringify(resp));
            mongoclient.close();
            res.send(resp);
          } else if (account2.length == 0 ){
            console.log("Source account does not exist");
            var resp = {responseCode: 1, message: "Source account does not exist"};
            console.log(JSON.stringify(resp));
            mongoclient.close();
            res.send(resp);
          } else {
            console.log("Source account exists - ", account2);

            var account_balance = account2[0].funds - minimum_balance;
            if ( account_balance >= amount_to_transfer ){
              console.log("Sufficient funds to transfer");
              var resp = {responseCode: 0, message: "Sufficient funds to transfer"};
              console.log(JSON.stringify(resp));
              mongoclient.close();
              res.send(resp);
            } else {
              console.log("Insufficient funds to transfer");
              var resp = {responseCode: 1, message: "Insufficient funds to transfer"};
              console.log(JSON.stringify(resp));
              mongoclient.close();
              res.send(resp);
            }
          }
        });
      }
    });
  });
});

app.get('/', function (req, res) {
    res.end( "Rest API implementation for Microservice ACCOUNT MANAGEMENT" );
});

var port = 8080;

var server = app.listen(port, function () {
  console.log("Account Management service listening on " + port);
});
