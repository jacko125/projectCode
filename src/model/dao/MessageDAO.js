var config = require('./../../../resources/config.json');

// Storage-specific (MongoDB) interface for User objects.
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');        
var util = require('util');
var mongoURL = "mongodb://" + config.db.host + ":" + config.db.port + "/" + config.db.name;

module.exports = {
    
    createMessage: mongoCommand(createMessage),    
    
    deleteMessage: mongoCommand(deleteMessage),
          
    getMessagesForUser: mongoCommand(getMessagesForUser),
    
    getAllMessages: mongoCommand(getAllMessages),
    
    deleteAllMessages: mongoCommand(deleteAllMessages),        
    
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

function createMessage(db, params) {
    console.log('Inserting ' + require('util').inspect(params.message));        
    db.collection('messages').insertOne(params.message, function(err, r) {
        assert.equal(err, null); //TODO MongoDB - Handle error gracefully  
        console.log("Inserted 1 documents into the message collection");        
        db.close();
    });    
}

function deleteMessage(db, params) {    
    db.collection('messages').removeOne(params.query, function(err, r) {
        if (r.result.n > 0) {
            console.log('Deleted existing message (' + params.query.sender + ':' + params.query.recipient + ')');
        }        
        db.close();
        params.callback();
    });    
}

function getMessagesForUser(db, params) {    
    
    return db.collection('messages').find({recipient: params.username}).toArray(function(err, docs) {
        db.close();
        console.log('Getting messages for ' + params.username);
        params.callback(docs);
    });
}

function getAllMessages(db, params) {
    return db.collection('messages').find({}).toArray(function(err, docs) {
        db.close();
        params.callback(docs);
    })
}

function deleteAllMessages(db, params) {
    db.collection('messages').removeMany({}, function(err, r) {
        console.log('Deleted ' + r.deletedCount + ' messages');
        db.close();
    });    
}