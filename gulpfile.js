var gulp = require('gulp');
var bump = require('gulp-bump');
var git = require('gulp-git');
var exec = require('child_process').exec;
var fs = require('fs');


var config = require('./resources/config.json');

gulp.task('default', function() {
  console.log('Usage: gulp <command>\n'
	+ 'Possible commands:\n'
    + 'supervisor           Start NodeJS server in this window (Cancellable after starting)\n'
	+ 'start-supervisor     Start NodeJS server in a new window (Cancellable after starting)\n'
	+ 'start-mongo          Start the MongoDB server (Cancellable after starting)\n' 
	+ 'stop-mongo           Stop the MongoDB server\n'  
    + 'deploy-bootstrap     Compile bootstrap.css from variables.less and deploy\n'
    + 'Release tasks:\n'
    + 'release-bump         Bump package.json version x.x.Y\n'
    + 'release-bump-minor   Bump package.json version x.Y.x\n'
    + 'release-commit       Commit package.json with release version message\n'
    + 'release-tag          Tag latest commit with release version\n'
	);
});

// Run app with Supervisor
gulp.task('start-supervisor', function(callback) {
    runCommandSync('start supervisor -e html,css,js,json -w src,resources index.js');    
});

gulp.task('supervisor', function(callback) {
    runCommandSync('supervisor -e html,css,js,json -w src,resources index.js');    
})

// MongoDB tasks
var mongoBaseDir = 'C:\\Program Files\\MongoDB\\Server'
gulp.task('init-mongo', runCommand('IF NOT EXIST data\\db ( mkdir data\\db )'));
gulp.task('start-mongo', ['init-mongo'], function (callback) {    
    fs.readdir(mongoBaseDir, function (err, list) {                    
        if (list.length == 0) {                                 
            console.log("MongoDB is not installed on this machine");
            return;
        }                   
        var mongoDir = mongoBaseDir + "\\" + list[0] + "\\bin";
        runCommandSync('start "MongoDB" "' + mongoDir + '\\mongod.exe" ' 
            + "--dbpath=" + __dirname+ "\\data\\db "
            + "--port=" + config.db.port);        
    });
});
gulp.task('stop-mongo', function(callback) {
    fs.readdir(mongoBaseDir, function (err, list) {                    
        if (list.length == 0) {                                 
            console.log("MongoDB is not installed on this machine");
            return;
        }                       
        var mongoDir = mongoBaseDir + "\\" + list[0] + "\\bin";
        runCommandSync('"' + mongoDir + '\\mongo.exe" admin --eval "db.shutdownServer();"');
    });    
});

//Bootstrap tasks
var bootstrap_ver = require('./package.json').dependencies.bootstrap;
gulp.task('compile-bootstrap', runCommand('cd node_modules\\bootstrap && grunt dist'));
gulp.task('deploy-bootstrap-css', ['compile-bootstrap'], runCommand('copy \
	node_modules\\bootstrap\\dist\\css\\bootstrap.css \
	src\\view\\_res\\util\\bootstrap\\bootstrap-' + bootstrap_ver + '.css')
	);
gulp.task('deploy-bootstrap-js', runCommand('copy \
	node_modules\\bootstrap\\dist\\js\\bootstrap.js \
	src\\view\\_res\\util\\bootstrap\\bootstrap-' + bootstrap_ver + '.js')
	);
gulp.task('deploy-bootstrap', ['deploy-bootstrap-css', 'deploy-bootstrap-js']);

// Release tasks
gulp.task('release-bump', function() {
    gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});
gulp.task('release-bump-minor', function() {
    gulp.src('./package.json')
        .pipe(bump({ type:'minor' }))
        .pipe(gulp.dest('./'));
});
gulp.task('release-commit', function() {    
    return gulp.src('./package.json')
        .pipe(git.commit('Rolling package.json version to ' + require('./package.json').version + ' for release'    ));
});
gulp.task('release-tag', function() {
    git.tag('release-' + require('./package.json').version, "Release for MIA");    
});
     
function runCommand(command) {
  return function (cb) {
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
}
function runCommandSync(command) {
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