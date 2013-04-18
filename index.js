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

  if(!grunt.file.findup(config.ROLLBACK)) {
    grunt.log.error(msg.YOU_ARE_NOT_IN_A_DEPLOY_FOLDER);
    return false;
  }

  var self           = this,
      deployPath     = path.join(grunt.file.findup(config.ROLLBACK), '../',
                         config.DEPLOYS, path.basename(instance, '.zip'));
      deployablePath = path.join(grunt.file.findup(config.ROLLBACK), '../',
                        config.DEPLOYABLES, instance);

  if(!grunt.file.exists(deployablePath)) {
    grunt.log.error(msg.YOU_HAVENT_DEPLOYED_A_TAG_YET);
    return false;
  }
  if(grunt.file.exists(deployPath)) {
    grunt.file.delete(deployPath);
  }

  exec('echo A | unzip ' +
    path.join(grunt.file.findup(config.ROLLBACK), '../', config.DEPLOYABLES, instance) + ' -d ' +
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
          grunt.log.ok(msg.START_RUNNING_TESTS);
          self.runTest(this, function() {
            grunt.log.error(msg.SOME_TEST_DIDNT_PASS);
          });
        }, function() {
          grunt.log.ok(msg.ALL_TEST_WAS_OK);
          self.lastSuccess = self.tryInstance;
          self.saveLastSuccess();
          self.startServer(this, function() {
            grunt.log.error(msg.SOMETHING_WENT_WRONG_WHEN_STARTING_SERVER);
          });
        }
      );
  });
};

Rollback.prototype.startServer = function(cb, err) {

  var instanceDir =
  path.join(
    grunt.file.findup(config.ROLLBACK), '../',
    config.DEPLOYS,
    path.basename(this.lastSuccess, '.zip')
  );

  var cmd = 'forever start -l ' + instanceDir + '/output.log -e ' + instanceDir + '/error.log dist/server.js';
  exec(cmd,
    { cwd : instanceDir }
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

Rollback.prototype.runTest = function(cb, err) {
  var self = this;
  // Chmod
  fs.chmodSync(path.join(
    grunt.file.findup(config.ROLLBACK), '../',
    config.DEPLOYS,
    path.basename(this.tryInstance, '.zip'),
    'bin/test'
  ), '755');
  exec('npm test',
    { cwd : path.join(
      grunt.file.findup(config.ROLLBACK), '../',
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
  var pointersPath = grunt.file.findup(config.ROLLBACK),
      lastSuccessPath = path.join(pointersPath, config.LAST_SUCCESS);

  if(!grunt.file.exists(pointersPath)) {
    grunt.file.mkdir(pointersPath);
  }

  if(grunt.file.exists(lastSuccessPath)) {
    fs.unlinkSync(lastSuccessPath);
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
      grunt.file.findup(config.ROLLBACK), '../',
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

Rollback.prototype.closeServer = function(cb) {
  var instanceDir =
  path.join(
    grunt.file.findup(config.ROLLBACK), '../',
    config.DEPLOYS,
    path.basename(this.lastSuccess, '.zip')
  );
  var cmd = 'forever stop dist/server.js';
  exec(cmd,
    { cwd : instanceDir }
    , function(error, stdout, stderr) {
      if(!error) {
        grunt.log.ok(msg.OLD_INSTANCE_CLOSED);
        cb();
      } else {
        grunt.log.ok(msg.OLD_INSTANCES_PROBABLY_ALREADY_CLOSED);
        cb();
      }
  });
};

Rollback.prototype.setTarType = function(type) {
  this.tarType = type;
};

Rollback.prototype.getLastSuccess = function() {
  if(!grunt.file.exists(path.join(grunt.file.findup(config.ROLLBACK), config.LAST_SUCCESS))) {
    return msg.THERE_IS_NO_INSTANCES_STARTED;
  }
  return this.lastSuccess;
};

Rollback.prototype.setLastSuccess = function(lastSuccess) {
  this.lastSuccess = lastSuccess;
};

Rollback.prototype.init = function() {
  if(!grunt.file.findup(config.ROLLBACK)) {
    grunt.file.mkdir(path.join(__dirname, 'deploys'));
    grunt.file.mkdir(path.join(__dirname, 'deployables'));
    grunt.file.mkdir(path.join(__dirname, '.rollback'));
    grunt.log.ok('Initialize a depoy folder');
  } else {
    grunt.log.ok('Your folder is already a deploy folder');
  }
};

module.exports = Rollback;
