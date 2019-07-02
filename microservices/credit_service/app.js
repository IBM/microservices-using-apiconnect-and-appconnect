var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

app.use(bodyParser.json());

// Connect to db
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
  collection.find().toArray(function(err, items) {
    console.log("Collection items : ", items);
    mongoclient.close();
  });
});

app.post('/credit_account', function (req, res) {

	var body = req.body;
  console.log(JSON.stringify(body));
  
  var target_account = body['target_accountID'];
  var amount_to_transfer = body['amount_to_transfer'];
  var transactionID = body['transactionID'];

  MongoClient.connect(url, {useNewUrlParser: true} , function(err, mongoclient) {
    if(err) {
      console.log("Mongo DB connection failed");
      return console.dir(err);
    }
    console.log("Mongo DB connection successful");
    var database = mongoclient.db("test");

    var collection = database.collection('accountdetails');
    collection.find().toArray(function(err0, items) {
      console.log("Collection items(accountdetails) : ", items);
    });
    collection.findOne({_id:target_account}, function(err1, account1){
      //console.log("in find query ", err1, "account " ,account1);
      if(err1){
        console.log("Credit transaction failed - Internal DB Server Error");
        console.log(err1);
        var resp = {transactionID:0, responseCode: 1, message: "Credit transaction failed - Internal DB server error"};
        console.log(JSON.stringify(resp));
        mongoclient.close();
        res.send(resp);
      } else if (account1) {
        //Temporary code to test -ve scenario
        console.log("Account ID is : ", account1._id);
        if (account1._id == "124"){
          console.log("testing negative scenario  ");
                        var resp = {transactionID: -2, responseCode: 1, message: "Credit transaction failed"};
                        console.log(JSON.stringify(resp));
                        //mongoclient.close();
                        res.send(resp);
        } else {   
        //Temporry code ends
        //console.log("acc length ", account1);
        var account_balance = account1.funds + amount_to_transfer;
        try {
          collection.updateOne({_id:target_account}, { $set: {"funds":account_balance}}, function(err2, response){
            if (response.modifiedCount == 1) {
              console.log("Credit transaction successful");
              collection.findOne({_id:target_account}, function(err3, updatedDoc){
                console.log("Updated Document: ", updatedDoc);
              });              
              try {
                var collection1 = database.collection('transactionlog');
                if (transactionID) {
                  collection1.updateOne({_id:ObjectID(transactionID)},
                  { $set: { target_account:target_account, credited_amount:amount_to_transfer, credit_transaction_code:0}},
                    function(err4, response1){
                      //console.log(response1);
                      if(response1.modifiedCount == 1){
                        console.log("transaction log updated, transaction ID - ", transactionID);
                        var resp = {transactionID: transactionID, responseCode: 0, message: "Funds transfer successful"};
                        console.log(JSON.stringify(resp));
                        mongoclient.close();
                        res.send(resp);
                      }
                   });
                } else {
                  collection1.insertOne(
                    { source_account:0, debited_amount:0, transfer_type:"NA", remarks:"Credit transaction successful (Amount reversed)", debit_transaction_code:-1, target_account:target_account, credited_amount:amount_to_transfer, credit_transaction_code:0 },
                      function(err4, doc){
                        transactionID = doc.insertedId;
                        console.log("Credit transaction successful (Amount reversed). Inserted transaction in transaction log, transaction ID - ", transactionID);
                        var resp = {transactionID: transactionID, responseCode: 0, message: "Credit transaction successful (Amount reversed)"};
                        console.log(JSON.stringify(resp));
                        mongoclient.close();
                        res.send(resp);
                     });
                }
                
              } catch (e) {
                console.log("In catch block of transaction log update - ", e);
                var resp = {transactionID: -1, responseCode: 0, message: "Credit transaction successful but failed to update the transaction log"};
                console.log(JSON.stringify(resp));
                mongoclient.close();
                res.send(resp);
              }
            }
          }); 
        } catch (e) {
          console.log("In catch block of account update - ", e);
          var resp = {transactionID:0, responseCode: 1, message: "Credit transaction failed - Internal DB server error"};
          console.log(JSON.stringify(resp));
          mongoclient.close();
          res.send(resp);
        }
      } 
      } else {
        console.log("in else ", account1);
        console.log("Credit transaction failed - Internal Server Error");
        var resp = {transactionID:0, responseCode: 1, message: "Credit transaction failed - Internal server error"};
        console.log(JSON.stringify(resp));
        mongoclient.close();
        res.send(resp);
      }
    });
  });
});

app.get('/', function (req, res) {
    res.end( "Rest API implementation for Microservice CREDIT ACCOUNT" );
});

var port = 8080;

var server = app.listen(port, function () {

  console.log("Credit Account service listening on " + port);

})