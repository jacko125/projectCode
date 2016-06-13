// Storage-specific (MongoDB) interface for User objects.
var MongoClient = require('mongodb').MongoClient
var logger = require('winston');
var assert = require('assert');        
var util = require('util');

var config = require('./../../../resources/config.json');
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
    db.collection('messages').insertOne(params.message, function(err, r) {
        assert.equal(err, null); //TODO MongoDB - Handle error gracefully  
        logger.debug('Inserted message to DB', params.message); 
        db.close();
    });    
}

function deleteMessage(db, params) {    
    db.collection('messages').removeOne(params.query, function(err, r) {
        if (r.result.n > 0) {
            logger.debug('Deleted existing message from DB', params.query)
        }        
        db.close();
        params.callback();
    });    
}

function getMessagesForUser(db, params) {    
    
    return db.collection('messages').find({recipient: params.username}).toArray(function(err, docs) {
        db.close();
        logger.debug('Getting messages from DB for %s', params.username);
        params.callback(docs);
    });
}

function getAllMessages(db, params) {
    return db.collection('messages').find({}).toArray(function(err, docs) {
        db.close();
        logger.debug('Getting all messages (count=%s)', docs.length);
        params.callback(docs);
    })
}

function deleteAllMessages(db, params) {
    db.collection('messages').removeMany({}, function(err, r) {        
        logger.debug('Deleted all messages (deletedCount=%s)', r.deletedCount);
        db.close();
    });    
}