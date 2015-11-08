var gulp = require('gulp');
var exec = require('child_process').exec;
var pjson = require('./package.json');

gulp.task('default', function() {
  console.log('Usage: gulp <command>\n'
	+ 'Possible commands:\n'
	+ 'start-app            Start NodeJS server\n'
	+ 'start-mongo          Start the MongoDB server (Can cancel gulp-task after starting)\n' 
	+ 'stop-mongo           Stop the MongoDB server)\n'
    + 'deploy-bootstrap     Compile bootstrap.css from variables.less and deploy\n'
	);
});

// Run app
gulp.task('start-app', runCommand('node index.js'));

// MongoDB tasks
var mongo_dir = 'C:\\Program Files\\MongoDB\\Server\\3.0\\bin';
gulp.task('init-mongo', runCommand('IF NOT EXIST data\\db ( mkdir data\\db )'));
gulp.task('start-mongo', ['init-mongo'], runCommand('start "MongoDB" "' + mongo_dir + '\\mongod.exe" --dbpath="' + __dirname+ '\\data\\db"'));			
gulp.task('stop-mongo', runCommand('"' + mongo_dir + '\\mongo.exe" admin --eval "db.shutdownServer();"'));

//Bootstrap tasks
var bootstrap_ver = pjson.dependencies.bootstrap;
gulp.task('compile-bootstrap', runCommand('cd node_modules\\bootstrap && grunt dist'));
gulp.task('deploy-bootstrap-css', ['compile-bootstrap'], runCommand('copy \
	node_modules\\bootstrap\\dist\\css\\bootstrap.css \
	src\\view\\res\\css\\bootstrap-' + bootstrap_ver + '.css')
	);
gulp.task('deploy-bootstrap-js', runCommand('copy \
	node_modules\\bootstrap\\dist\\js\\bootstrap.js \
	src\\view\\res\\js\\bootstrap-' + bootstrap_ver + '.js')
	);
gulp.task('deploy-bootstrap', ['deploy-bootstrap-css', 'deploy-bootstrap-js']);
 
function runCommand(command) {
  return function (cb) {
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
}