# The Macquarie Interactive App (MIA)

## Prerequisites

1. Install Git (for Windows)
2. Install NodeJS
3. Install MongoDB (in its default location)



## Installation

```
Clone the repository and go to the folder.

Install required packages (it reads from from package.json)
$ npm install

Start the server
$ gulp start-app (or node index.js)

View the web app at http://localhost:3000
The controller/module/DAO test can be found at /test

```



## Advanced features

```
To view a list of available commands:
$ gulp

For auto-refreshing the server when files are changed, use Supervisor
$ npm install -g supervisor
To use Supervisor instead of 'gulp start-app' or 'node index.js', use:
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


    










