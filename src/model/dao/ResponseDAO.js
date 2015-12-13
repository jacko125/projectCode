// Storage-specific (MongoDB) accessors for User objects.
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');        
var util = require('util');

var hostname = '127.0.0.1';
if (process.env.ENVIRONMENT == 'prod') {
    hostname = 'ntsydv1946';
}             
var mongoURL = 'mongodb://' + hostname +':27017/mia';

module.exports = {
    
	createResponse: mongoCommand(createResponse),
    
    deleteResponse: mongoCommand(deleteResponse),
          
    getResponsesForUser: mongoCommand(getResponsesForUser),
    
    getAllResponses: mongoCommand(getAllResponses),
    
    deleteAllResponses: mongoCommand(deleteAllResponses)
            
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

function createResponse(db, params) {    
    db.collection('responses').insertOne(params.response, function(err, r) {
        assert.equal(err, null); //TODO MongoDB - Handle error gracefully  
        console.log('Inserted ' + require('util').inspect(params.response));    
        db.close();
    });    
}

function deleteResponse(db, params) {

    db.collection('responses').removeOne(params, function(err, r) {
        if (r.result.n > 0) {
            console.log('Deleted existing response (' + params.sender + ':' + params.recipient + ')');
        }        
        db.close();
        params.callback();
    });    
}

function getResponsesForUser(db, params) {               
    return db.collection('responses').find({recipient: params.username}).toArray(function(err, docs) {
        db.close();
        console.log('Getting responses for ' + params.username);
        params.callback(docs);
    });
}

function getAllResponses(db, params) {
    return db.collection('responses').find({}).toArray(function(err, docs) {
        db.close();
        params.callback(docs);
    })
}

function deleteAllResponses(db, params) {
    db.collection('responses').removeMany({}, function(err, r) {
        console.log('Deleted ' + r.deletedCount + ' responses');
        db.close();
    });    
}

function deleteResponse(db, params) {
    var condition = {
        sender: params.sender,
        recipient: params.recipient
    }
    
    db.collection('responses').removeOne(condition, function(err, r) {
        console.log('Deleted one response, condition: ' + util.inspect(condition));
        db.close();
        params.callback();
    });
}

















