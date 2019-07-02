var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.json());

// Connect to the db 
var connection_url = "CONNECTION_URL";
var url = "mongodb://"+ connection_url + "/test";
MongoClient.connect(url, {useNewUrlParser: true} , function(err, mongoclient) {
  if(err) {
    console.log("Mongo DB connection failed");
    return console.dir(err);
  }
  console.log("Mongo DB connection successful");
  var database = mongoclient.db("test");

  var collection = database.collection('accountdetails');
  collection.find().toArray(function(err1, items) {
    console.log("Collection(accountdetails) items : ", items);
    mongoclient.close();
  });
});

app.post('/debit_account', function (req, res) {

	var body = req.body;
	console.log(JSON.stringify(body));
  
  var source_account = body['source_accountID'];
  var amount_to_transfer = body['amount_to_transfer'];
  var remarks = body['remarks'];
  var transfer_type = body['transfer_type'];
  var transactionID;
  
  MongoClient.connect(url, {useNewUrlParser: true} , function(err, mongoclient) {
    if(err) {
      console.log("Mongo DB connection failed");
      return console.dir(err);
    }
    console.log("Mongo DB connection successful");
    var database = mongoclient.db("test");

    var collection = database.collection('accountdetails');
    collection.find().toArray(function(err, items) {
      console.log("Collection(accountdetails) items : ", items);
    });
    collection.find({_id:source_account}).toArray(function(err1, account1){
      if(err1){
        console.log("Debit transaction failed - Internal DB Server Error");
        console.log(err1);
        var resp = {transactionID:0, responseCode: 1, message: "Debit transaction failed - Internal DB server error"};
        console.log(JSON.stringify(resp));
        mongoclient.close();
        res.send(resp);
      } else if (account1.length > 0) {
        //console.log("acc length ", account1);
        var account_balance = account1[0].funds - amount_to_transfer;
        try {
          collection.updateOne({_id:source_account}, { $set: {"funds":account_balance}}, function(err2, response){
            if (response.modifiedCount == 1) {
              console.log("Debit transaction successful");
              collection.findOne({_id:source_account}, function(err3, updatedDoc){
                console.log("Updated Document: ", updatedDoc);
              });
              try {
                var collection1 = database.collection('transactionlog');
                collection1.insertOne(
                  { source_account:source_account, debited_amount:amount_to_transfer, transfer_type:transfer_type, remarks:remarks, debit_transaction_code:0},
                    function(err4, doc){
                      transactionID = doc.insertedId;
                      console.log("Inserted transaction in transaction log, transaction ID - ", transactionID);
                      var resp = {transactionID: transactionID, responseCode: 0, message: "Debit transaction successful"};
                      console.log(JSON.stringify(resp));
                      mongoclient.close();
                      res.send(resp);
                   });
              } catch (e) {
                console.log("In catch block - ", e);
                var resp = {transactionID: -1, responseCode: 0, message: "Debit transaction successful but failed to create an entry in transaction log"};
                console.log(JSON.stringify(resp));
                mongoclient.close();
                res.send(resp);
              }
            }
          }); 
        } catch (e) {
          console.log("In catch block - ", e);
          var resp = {transactionID:0, responseCode: 1, message: "Debit transaction failed - Internal DB server error"};
          console.log(JSON.stringify(resp));
          mongoclient.close();
          res.send(resp);
        } 
      } else {
        console.log("in else ", account1);
        console.log("Debit transaction failed - Internal Server Error");
        var resp = {transactionID:0, responseCode: 1, message: "Debit transaction failed - Internal server error"};
        console.log(JSON.stringify(resp));
        mongoclient.close();
        res.send(resp);
      }
    });
  });
});

app.get('/', function (req, res) {
    res.end( "Rest API implementation for Microservice DEBIT ACCOUNT" );
});

var port = 8080;

var server = app.listen(port, function () {

  console.log("Debit Account service listening on " + port);

})