# The Macquarie Interactive App (MIA)

## Installation

```
Clone the repository

Install required packages (from package.json)
$ npm install

Start the server
$ gulp start-app (or node index.js)

```

## Advanced features

```
To view a list of available commands:
$ gulp

For auto-refreshing the server when files are changed, use Supervisor:
$ npm install -g supervisor
$ supervisor -e html,css,js -w src index.js

For modifying/compiling Bootstrap CSS, an external Internet connection is required.
Install grunt-cli and Bootstrap's dependencies first.
$ npm install -g grunt-cli
$ cd node_modules\bootstrap && npm install

Use http://bootstrap-live-customizer.com/ to generate a custom "variables.less" file.
Apply the custom changes to \node_modules\bootstrap\less\variables.less
$ gulp deploy-bootstrap
```


    










