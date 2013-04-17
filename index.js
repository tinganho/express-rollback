var util   = require('util'),
    grunt  = require('grunt'),
    sys    = require('sys'),
    exec   = require('child_process').exec,
    unzip  = require('unzip'),
    fs     = require('fs'),
    config = require('./conf/config'),
    path   = require('path'),
    step   = require('step'),
    msg    = require('./conf/messages');

function Rollback() {
  this.lastSuccess;
  this.tryInstance;
  this.serverPid;
  this.tarType;
};

Rollback.prototype.try = function(instance) {
  this.tryInstance   = instance;
  var self           = this,
      deployPath     = path.join(process.cwd(),
                         config.DEPLOYS, path.basename(instance, '.zip'));
      deployablePath = path.join(process.cwd(),
                        config.DEPLOYABLES, instance);

  if(!grunt.file.exists(deployablePath)) {
    grunt.log.error(msg.YOU_HAVENT_DEPLOYED_A_TAG_YET);
    return false;
  }
  if(grunt.file.exists(deployPath)) {
    grunt.file.delete(deployPath);
  }

  exec('echo A | unzip ' +
    path.join(process.cwd(), config.DEPLOYABLES, instance) + ' -d ' +
    deployPath
    , function(err, stdout, stderr) {
      step(
        function() {
          self.build(this, function() {
            grunt.log.error(msg.SOMETHING_WENT_WRONG_WITH_THE_BUILD);
          });
          grunt.log.ok(msg.START_BUILDING);
        }, function() {
          grunt.log.ok(msg.THE_BUILD_WAS_OK);
          grunt.log.ok(msg.START_CLOSING_OLD_INSTANCES);
          self.closeServer(this);
        }, function() {
          self.runTest(this, function() {
            grunt.log.error(msg.SOME_TEST_DIDNT_PASS);
          });
        }, function() {
          self.lastSuccess = self.tryInstance;
          self.saveLastSuccess();
          self.startServer(this, function() {
            grunt.log.error(msg.SOMETHING_WENT_WRONG_WHEN_STARTING_SERVER);
          });
          grunt.log.ok(msg.ALL_TEST_WAS_OK);
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
          grunt.log.ok(msg.THE_NEW_INSTANCE_STARTED);
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
    config.OUTPUT_LOG
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
  exec('npm test',
    { cwd : path.join(
      process.cwd(),
      config.DEPLOYS,
      path.basename(this.tryInstance, '.zip'))
    }
  , function(error, stdout, stderr) {
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

  var timer = setInterval(function() {
    grunt.log.ok(msg.STILL_BUILDING);
  }, 500*60);

  exec(cmd,
    { cwd : path.join(
      process.cwd(),
      config.DEPLOYS,
      path.basename(this.tryInstance, '.zip')
    )}
  , function(error, stdout, stderr) {
    clearInterval(timer);
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
    try {
      process.kill(pid);
      var pidPath = path.join(config.ROLLBACK, config.SERVER_PID);
      if(grunt.file.exists(pidPath)) {
        grunt.file.delete(pidPath);
      }
      if(typeof cb === 'function') {
        cb();
      }
    } catch(e) {
      grunt.log.ok(msg.SERVER_PROBABLY_ALREADY_CLOSED);
      if(typeof cb === 'function') {
        cb();
      }
    };
  } else {
    cb();
  }
};

Rollback.prototype.setTarType = function(type) {
  this.tarType = type;
};

Rollback.prototype.getLastSuccess = function() {
  return this.lastSuccess;
};

Rollback.prototype.setLastSuccess = function(lastSuccess) {
  this.lastSuccess = lastSuccess;
};

module.exports = Rollback;
