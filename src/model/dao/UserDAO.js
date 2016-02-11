// Storage-specific (MongoDB) accessors for User objects.
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');        
var util = require('util');

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
    console.log("Inserting 1 user (" + params.user.username + ") into the user collection");
    db.collection('users').insertOne(params.user, function(err, result) {
        assert.equal(err, null);        
        db.close();
        params.callback(result.ops[0]);
    });
    
}

function getUser(db, params) {  
    console.log('Getting user: ' + params.username);      
    db.collection('users').find({username: params.username}).toArray(function(err, users) {
        assert.equal(err, null);        
        db.close();                
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
            console.log('Updated defaultLoc for user ' + params.username);
            params.callback();
        });
}

function getAllUsers(db, params) {
     db.collection('users').find({}).toArray(function(err, docs) {
        db.close();
        params.callback(docs);
    });
}

function deleteAllUsers(db, params) {
    db.collection('users').removeMany({}, function(err, r) {
        console.log('Deleted ' + r.deletedCount + ' users');
        db.close();
    });    
}


