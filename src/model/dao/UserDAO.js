// Storage-specific (MongoDB) accessors for User objects.
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');        
var util = require('util');
var logger = require('winston');

var config = require('./../../../resources/config.json');
var mongoURL = "mongodb://" + config.db.host + ":" + config.db.port + "/" + config.db.name;

module.exports = {
	
	createUser: mongoCommand(createUser),
    
    getUser: mongoCommand(getUser),
    
    updateUser: mongoCommand(updateUser),
    
    getAllUsers: mongoCommand(getAllUsers),
    
    deleteAllUsers: mongoCommand(deleteAllUsers)
    
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

function createUser(db, params) {    
    db.collection('users').insertOne(params.user, function(err, result) {
        assert.equal(err, null);        
        db.close();
        logger.debug('Inserted user to DB', params.user);
        params.callback(result.ops[0]);
    });
    
}

function getUser(db, params) {      
    db.collection('users').find({username: params.username}).toArray(function(err, users) {
        assert.equal(err, null);        
        db.close();             
        logger.debug('Getting user from DB (username=%s)', params.username);
        params.callback(users);
    });
}

function updateUser(db, params) {            
    db.collection('users').update(
        { username: params.user.username },
        params.user,
        function(err, doc) {
            assert.equal(err, null);
            db.close();
            logger.debug('Updated defaultLoc for %s', params.user.username, params.user);            
            params.callback();
        });
}

function getAllUsers(db, params) {
     db.collection('users').find({}).toArray(function(err, docs) {
        db.close();
        logger.debug('Getting all users (count=%s)', docs.length);
        params.callback(docs);
    });
}

function deleteAllUsers(db, params) {
    db.collection('users').removeMany({}, function(err, r) {        
        db.close();
        logger.debug('Deleted all users (deletedCount=%s)', r.deletedCount);
    });    
}


