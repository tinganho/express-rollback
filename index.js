
var util   = require('util'),
    grunt  = require('grunt'),
    sys    = require('sys'),
    exec   = require('child_process').exec,
    unzip  = require('unzip'),
    fs     = require('fs'),
    config = require('./conf/config'),
    path   = require('path'),
    step   = require('step');

function Rollback() {
  this.lastSuccess;
  this.tryInstance;
  this.serverPid;
  this.tarType =
  this.tars = {
    tar   : 'tar xvfz',
    unzip : 'unzip'
  }
};

Rollback.prototype.try = function(instance) {
  this.tryInstance = instance;
  var self       = this,
      deployPath = path.join(process.cwd(),
                    config.DEPLOYS, path.basename(instance, '.zip'));

  if(grunt.file.exists(deployPath)) {
    grunt.file.delete(deployPath);
  }

  exec('unzip ' +
    path.join(process.cwd, config.DEPLOYABLES, instance) + ' -d ' +
    deployPath
    , function(err, stdout) {
      step(
        function() {
          self.build(this, function() {
            grunt.log.error('Something went wrong with the build');
            process.exit();
          });
        }, function() {
          self.runTest(this, function() {
            grunt.log.error('Some test didn\' pass');
            process.exit();
          });
          grunt.log.ok('The build was ok');
        }, function() {
          self.closeServer(this);
        }, function() {
          this.lastSuccess = this.tryInstance;
          self.saveLastSuccess();
          self.startServer(this, function() {
            grunt.log.error('Something went wrong when starting server');
            process.exit();
          });
          grunt.log.ok('All test was ok');
        }, function() {
          var pid = self.getLatestPid();
          self.storePid(pid);
        }
      );
  });
};

Rollback.prototype.startServer = function(cb, err) {

  var cmd = 'nohup bash -c "node dist/server.js > output.log 2>&1 &"';

  exec(cmd,
    { cwd :
      path.join(
        process.cwd(),
        config.DEPLOYS,
        path.basename(this.lastSuccess, '.zip')
      )}
    , function(error, stdout, stderr) {
      if(!error) {
        setTimeout(function() {
          cb();
        }, 1000);
      } else {
        console.log(stderr);
        err();
      }
  });

};

Rollback.prototype.storePid = function(pid) {
  var pointersPath = path.join(process.cwd(), config.ROLLBACK),
      serverPidPath = path.join(pointersPath, config.SERVER_PID);

  if(!grunt.file.exists(pointersPath)) {
    grunt.file.mkdir(pointersPath);
  }
  grunt.file.write(serverPidPath, pid);
};

Rollback.prototype.getLatestPid = function() {
  var content =
  grunt.file.read(path.join(
    process.cwd(),
    config.DEPLOYS,
    path.basename(this.lastSuccess, '.zip'),
    'output.log'
  ));
  return content.match(/^\d+/)[0];
};

Rollback.prototype.runTest = function(cb, err) {
  var self = this;
  // Chmod
  fs.chmodSync(path.join(
    process.cwd(),
    config.DEPLOYS,
    path.basename(this.tryInstance, '.zip'),
    'bin/test'
  ), '755');
  var cmd =
  String.prototype.concat(
    'cd ',
    path.join(
      process.cwd(),
      config.DEPLOYS,
      path.basename(this.tryInstance, '.zip')
    ),
    ' && npm test'
  );
  exec(cmd, function(error, stdout, stderr) {
    if(!error) {
      cb();
    } else {
      console.log(stderr);
      err();
    }
  });
};

Rollback.prototype.saveLastSuccess = function() {
  var pointersPath = path.join(process.cwd(), config.ROLLBACK),
      lastSuccessPath = path.join(pointersPath, config.LAST_SUCCESS);

  if(!grunt.file.exists(pointersPath)) {
    grunt.file.mkdir(pointersPath);
  }

  if(grunt.file.exists(lastSuccessPath)) {
    grunt.file.delete(lastSuccessPath);
  }

  grunt.file.write(lastSuccessPath, this.lastSuccess);
};

Rollback.prototype.build = function(cb, err) {
  var cmd = 'npm install'

  exec(cmd,
    { cwd : path.join(
      process.cwd(),
      config.DEPLOYS,
      path.basename(this.tryInstance, '.zip')
    )}
  , function(error, stdout, stderr) {
    if(!error) {
      cb();
    } else {
      console.log(stderr);
      err();
    }
  });
};

Rollback.prototype.getCurrentPid = function() {
  var _path =
  path.join(
    config.ROLLBACK,
    config.SERVER_PID
  );
  if(grunt.file.exists(_path)) {
    return grunt.file.read(_path);
  } else {
    return false;
  }
};

Rollback.prototype.closeServer = function(cb) {
  var pid = this.getCurrentPid();
  if(pid) {
    process.kill(pid);
    console.log('hej')
  }
  setTimeout(function() {
    cb();
  }, 3000);
};

Rollback.prototype.setTarType = function(type) {
  this.tarType = type;
};

Rollback.prototype.getLastSuccess = function() {
  return this.lastSuccess;
};

Rollback.prototype.revert = function() {

};

Rollback.prototype.setLastSuccess = function(lastSuccess) {
  this.lastSuccess = lastSuccess;
};

module.exports = Rollback;
