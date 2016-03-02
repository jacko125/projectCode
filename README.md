# The Macquarie Interactive App (MIA)
Note: these steps have only been tested for Windows.
## Prerequisites

1. Install Git (for Windows)
2. Install NodeJS
3. Install MongoDB (in its default location)

## Installation + First time setup

#### Before cloning from Git
Set autocrlf to 'true' before making any changes (for consistency)

    git config --global core.autocrlf true

Set sslVerify to 'false' (Git throws an error when cloning over HTTPS otherwise)
    
	git config --global http.sslVerify false

#### 1. Clone the repository from Stash
Navigate to the repo on Stash. Hit the clone button to get the URL to clone the repo.  
You can then use this with the git clone command. 

    git clone ssh://git@stash.internal.macquarie.com/~hgoh2/the-grad-project-mia.git
This will require you to be added to the project on Stash. See Henry/Alec if you need access.

#### 2. Download, install, setup and run CNTLM
Download and install CNTLM from http://cntlm.sourceforge.net/
Open the config file under ``C:\Program Files (x86)\Cntlm\cntlm.ini``  
Run the following command using your network credentials (from the Cntlm install folder)

    cntlm -H -u <username> -d pc.internal.macbank

Enter your network password when prompted. Your hashed values (3 lines) will be displayed on the screen.    
Copy these into the cntlm.ini file, e.g.

    Username    acollie2
    Domain      pc.internal.macbank
    PassLM      xxxxxx (from output)
    PassNT      xxxxxx (from output)
    PassNTLMv2  xxxxxx (from output)

Update cntlm.ini with the proxy info and forwarding port (used by npm) 

    Proxy       proxy.lb.macbank:8080
    Listen      53128
    
Start CNTLM (this can be done in Services as admin). Alternatively, you can run CNTLM from the commandline with `` cntlm -c cntlm.ini -v ``

#### 3. Configure npm to use the CNTLM proxy
If another process is using port 53128, it can be changed (in both cntlm.ini and the npm configuration)

    npm config set proxy http://localhost:53128
    npm config set https-proxy https://localhost:53128
    npm config set registry "http://registry.npmjs.org"

#### 4. Install dependent nodeJS packages
Install required packages (it reads from package.json). 
This will take a while to complete for the first time. 

    npm install
    npm install -g gulp
	
#### 5. Setting the configuration file for your environment
The application reads from a config file to get parameters for specific environments (domains/ports to use, etc), found at ``/resources/config.json``    
By default, this file is the same as config-dev.json. By modifying this file, you can run multiple instances of MIA on the same host. 

#### 6. Running the application
Start the mongoDB server, HTTP server and websocket server. (any order)

    gulp start-mongo (Cancel the task after MongoDB spawns in another window)
    start node index.js
	start node ws-server.js

You can then view the web app at http://localhost:3000 (or on whatever port was configured in ``/resources/config.json``)

# Advanced features

There is a gulp.js file that has automated some of the commands. Gulp should have been installed globally (in step 4)    
To view a list of available commands, use ``gulp``  

For auto-refreshing the server when files are changed, use Supervisor

    npm install -g supervisor
    gulp start-supervisor (Cancel the task once the new window has spawned)
    
metro-bootstrap was used for MIA. You can find it here: http://talkslab.github.io/metro-bootstrap/

This installation guide has only been tested for Windows, but there isn't any reason why it shouldn't work for Linux.    
The only Windows-dependent elements can be found in ``/gulpfile.js``. Windows-specific paths for starting/stopping the MongoDB daemon have been hardcoded.