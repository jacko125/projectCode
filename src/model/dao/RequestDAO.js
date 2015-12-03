// Storage-specific (MongoDB) accessors for User objects.
var User = require('../Request.js');

var MongoClient = require('mongodb').MongoClient
var assert = require('assert');        
var util = require('util');

var mongoURL = 'mongodb://localhost:27017/mia';

module.exports = {
    
	createRequest: mongoCommand(createRequest),
          
    getRequestsForUser: mongoCommand(getRequestsForUser),
    
    getAllRequests: mongoCommand(getAllRequests),
    
    deleteAllRequests: mongoCommand(deleteAllRequests),
    
    deleteRequest: mongoCommand(deleteRequest)
    
}

// Wrapper for mongoDB calls
function mongoCommand(command) {    
    return function (params) {
        MongoClient.connect(mongoURL, function(err, db) {            
          assert.equal(null, err);
          
          //Execute command and get result          
          return command(db, params);
        });
    };
}

function createRequest(db, params) {
    console.log('Inserting ' + require('util').inspect(params.request));    
    
    db.collection('requests').insertOne(params.request, function(err, r) {
        assert.equal(err, null); //TODO MongoDB - Handle error gracefully  
        console.log("Inserted 1 documents into the request collection");        
        db.close();
    });    
}

function getRequestsForUser(db, params) {    
    
    return db.collection('requests').find({recipient: params.username}).toArray(function(err, docs) {
        db.close();
        console.log('Getting requests for ' + params.username);
        params.callback(docs);
    });
}


function getAllRequests(db, params) {
    return db.collection('requests').find({}).toArray(function(err, docs) {
        db.close();
        params.callback(docs);
    })
}

function deleteAllRequests(db, params) {
    db.collection('requests').removeMany({}, function(err, r) {
        console.log('Deleted ' + r.deletedCount + ' requests');
        db.close();
    });    
}

function deleteRequest(db, params) {
    var condition = {
        sender: params.sender,
        recipient: params.recipient
    }
    
    db.collection('requests').removeOne(condition, function(err, r) {
        console.log('Deleted one request, condition: ' + util.inspect(condition));
        db.close();
        params.callback();
    });
}

















