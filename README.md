# The Macquarie Interactive App (MIA)

## Prerequisites

1. Install Git (for Windows)
2. Install NodeJS
3. Install MongoDB (in its default location)

## Installation

```
Before cloning from Git
Set autocrlf to 'true' before making any changes (for consistency)
$ git config --global core.autocrlf true
Set sslVerify to 'false' (Git throws an error when cloning over HTTPS otherwise)
$ git config --global http.sslVerify false

Clone the repo

Install required packages (it reads from from package.json)
$ npm install

Start the HTTP server
$ start node index.js

Start the websocket server
$ start node ws-servier.js

Install gulp globally and start the mongoDB server
$ npm install -g gulp
$ gulp start-mongo

View the web app at http://localhost:3000
```

## Advanced features

```
There is a gulp.js file that has automated some of the commands.
$ gulp

For auto-refreshing the server when files are changed, use Supervisor.
$ npm install -g supervisor
$ supervisor -e html,css,js -w src index.js

For modifying and compiling Bootstrap CSS:
Install grunt-cli and Bootstrap's dependencies first. (Requires external internet connection once)
$ npm install -g grunt-cli
$ cd node_modules\bootstrap && npm install

After you've installed Bootstrap's dependencies, use http://bootstrap-live-customizer.com/ 
This tool generates changes for the "variables.less" file.
Apply the custom changes to \node_modules\bootstrap\less\variables.less
Deploy the changes to the web app with:
$ gulp deploy-bootstrap
```


    










