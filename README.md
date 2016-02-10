# The Macquarie Interactive App (MIA)

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

#### 2. Download and install CNTLM
Download CNTLM from http://cntlm.sourceforge.net/.  

## Advanced features
This is needed to be able to install dependent node.js packages on the Macquarie network (proxy authenticator).  
Run the setup to install CNTLM (requires admin).

#### 3. Configure and start CNTLM
Open the config file under ``C:\Program Files (x86)\Cntlm\cntlm.ini``  
Run the following command using your network credentials (from the Cntlm install folder)

    ./cntlm -H -u <username> -d pc.internal.macbank

Enter your network password when prompted. Your hashed values will be displayed on the screen.  
Copy these into the cntlm.ini file, e.g.

    Username    acollie2
    Domain      pc.internal.macbank
    PassLM      xxxxxx (from output)
    PassNT      xxxxxx (from output)
    PassNTLMv2  xxxxxx (from output)

Also update the proxy info

    Proxy       10.134.32.3:8080
    
Start CNTLM (this can be done in Services as admin)

#### 4. Setting the right configuration
The application reads from a config file to get parameters for specific environments, e.g. ports to run off and database names.  
To set this up correctly, you will need to rename one of the config files in the src folder to config.js. The deployment script will do this automatically.  

#### 5. Install dependent nodeJS packages
Install required packages (it reads from package.json).  
This will take awhile to complete for the first time. 

    npm install
    npm install -g gulp
	
<br/>  
## Running the application
Start the required services. This will be TGP_mia_prod_httpd_service and TGP_mia_prod_ws_service in the Services list. 
Install gulp globally and start the mongoDB server

    gulp start-mongo
    node index.js
	node ws-server.js

View the web app at http://localhost:3000 
The ``controller/module/DAO`` test function can be found at http://localhost:3000/test  

<br/>  
## Advanced features

There is a gulp.js file that has automated some of the commands. To use this, install Gulp with the following command. This requires an external network. 

    npm install -g gulp 
To view a list of available commands, use ``gulp``  
For auto-refreshing the server when files are changed, use Supervisor

    npm install -g supervisor
To use Supervisor instead of 'gulp start-app' or 'node index.js', use:
    
    supervisor -e html,css,js -w src index.js

For modifying and compiling Bootstrap CSS:  
Install grunt-cli and Bootstrap's dependencies first. (Requires external internet connection once)
    
    npm install -g grunt-cli
    cd node_modules\bootstrap && npm install

After you've installed Bootstrap's dependencies, use http://bootstrap-live-customizer.com/  

This tool generates changes for the "variables.less" file.  
Apply the custom changes to ``\node_modules\bootstrap\less\variables.less``

Deploy the changes to the web app with:
    
    gulp deploy-bootstrap  
	
<br/>  
See https://confluence.atlassian.com/bitbucketserver/markdown-syntax-guide-776639995.html for help with Markdown syntax.  
See http://dillinger.io/ for a live Markdown editor (doesn't support line breaks). 