/*
    Script for installing/uninstalling MongoDB for MIA as a Windows service.       
    
    Usage: Usage: node mongodb_windows_svc [install | uninstall]
*/

var fs = require("fs");
var config = require("../resources/config.json");
var mongoBaseDir = "C:\\Program Files\\MongoDB\\Server";

if (process.argv.length != 3) {
    console.log('Usage: node httpd_windows_svc [install | uninstall]');
    return;
}

function install(){    
        
    fs.readdir(mongoBaseDir, function (err, list) {                    
        if (list.length == 0) {                                 
            console.log("MongoDB is not installed on this machine");
            return;
        }                   
        var mongoDir = mongoBaseDir + "\\" + list[0] + "\\bin";
        var dbpath = __dirname + "\\..\\data\\db";
        var logfile = __dirname + "\\..\\data\\mongodb-log.txt";
        var port = config.db.port;
        
        mkdirSync(dbpath);                
        
        var command = "\"" + mongoDir + "\\mongod.exe\""
            + " --install"
            + " --serviceName MongoDB_" + config.env
            + " --serviceDisplayName TGP_MIA_" + config.env + "_mongodb_service"
            + " --serviceDescription \"The Grad Project - MIA " + config.env + " MongoDB service\""
            + " --port " + port 
            + " --dbpath \"" + dbpath + "\""
            + " --logpath \"" + logfile + "\"";        
        
        runCommand(command);                

    });
    
 
  //console.log('Installed service');
}

function uninstall(){
    fs.readdir(mongoBaseDir, function (err, list) {                    
        if (list.length == 0) {                                 
            console.log("MongoDB is not installed on this machine");
            return;
        }                   
        var mongoDir = mongoBaseDir + "\\" + list[0] + "\\bin";
        
        var command = "\"" + mongoDir + "\\mongod.exe\""
            + " --remove"
            + " --serviceName MongoDB_" + config.env;
        
        runCommand(command);       
    });
}

switch (process.argv[2]) {
    case 'install':
        install();
        break;
    case 'uninstall':
        uninstall();
        break;
    default:
        console.log('Invalid option specified');        
}

var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

function runCommand(command) {
    const exec = require('child_process').exec;
    const child = exec(command,
      (error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        if (error !== null) {
          console.log(`exec error: ${error}`);
        }
    });    
}

