var chai   = require('chai'),
    exec   = require('child_process').exec,
    grunt  = require('grunt'),
    expect = require('chai').expect,
    http   = require('http'),
    step   = require('step');

describe('Rollback', function() {

  before(function(done) {
    this.timeout(10000);
    step(
      function() {
        exec('grunt clean:test'
        , { cwd : __dirname}
        , this);
      },
      function() {
        exec('node ../bin/rollback try instance1.zip' 
          , { cwd : __dirname}
          , this);
      },
      function() {
        done();
      }
    );
  });


  it('should be able try a new instance', function() {
    expect(grunt.file.exists(__dirname + '/deploys/instance1')).to.be.true;
  });

  // it('should be able to run test on the new instance', function() {

  // });

  // it('should be able to store a new pointer to the latest success', function() {
  //   expect(grunt.file.exists(__dirname + '/.pointers')).to.be.true;
  // });

  // it('should be able to start a server on the new instance', function() {
  //   http.get('http://localhost:3000/', function(req, res) {
  //     expect(res.statusCode).to.equal(200);
  //   });
  // });

  // it('should be able to close a server', function() {

  // });

});