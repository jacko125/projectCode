Note: these steps have only been tested for Windows.
## Prerequisites

1. Install Git (for Windows)
2. Install NodeJS
3. Install MongoDB (in its default location)
<br>

## Installation + First time setup

#### 4. Install dependent nodeJS packages
Install required packages (it reads from package.json). 
This will take a while to complete for the first time. 

    npm install
    npm install -g gulp
<br>
	
#### 5. Setting the configuration file for your environment
The application reads from a config file to get parameters for specific environments (domains/ports to use, etc), found at ``/resources/config.json``    
By default, this file is the same as config-dev.json. By modifying this file, you can run multiple instances of MIA on the same host. 
<br>
<br>

#### 6. Running the application
Start the mongoDB server, HTTP server and websocket server. (any order)

    gulp start-mongo (Cancel the task after MongoDB spawns in another window)
    start node index.js
	start node ws-server.js

You can then view the web app at http://localhost:3000 (or on whatever port was configured in ``/resources/config.json``)
<br>
<br>

# Advanced features

There is a gulp.js file that has automated some of the commands. Gulp should have been installed globally (in step 4)    
To view a list of available commands, use ``gulp``  

For auto-refreshing the server when files are changed, use Supervisor

    npm install -g supervisor
    gulp start-supervisor (Cancel the task once the new window has spawned)
    
metro-bootstrap was used for MIA. You can find it here: http://talkslab.github.io/metro-bootstrap/

This installation guide has only been tested for Windows, but there isn't any reason why it shouldn't work for Linux.    
The only Windows-dependent elements can be found in ``/gulpfile.js``. Windows-specific paths for starting/stopping the MongoDB daemon have been hardcoded.