var chai        = require('chai'),
    expect      = chai.expect,
    request     = require('supertest'),
    cheerio     = require('cheerio'),
    querystring = require('querystring'),
    Browser     = require('zombie'),
    exec        = require('child_process').exec,
    assert      = require('assert');

var server = require('../../../../server'), $;

module.exports = function(){

  describe('Signup',function() {
    this.timeout(15000)

    before(function(done) {

      exec('node app/server.js',function() {
        done();
      });
    });

    it('should be able to provide a site', function(done) {
      request(server)
      .get('/step1')
      .end(function(err, res){
        if (err) {
          throw err;
        }
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should be able to prefill weibo content', function(done) {

      var profileImage = 'http%3A%2F%2Ftp2.sinaimg.cn%2F2030735485%2F180%2F5614050274%2F1',
          userName     = 'P1CN',
          id           = '2030735485',
          gender       = 'male';

      request(server)
      .get('/step1?user_name=' + userName + '&id=' + id + '&gender=' + gender + '&profile_image=' + profileImage)
      .end(function(err, res){
        if (err) {
          throw err;
        }
        $ = cheerio.load(res.text);
        expect(res.statusCode).to.equal(200);
        expect($('.image-thumbnail-preview img').attr('src')).to.equal(unescape(profileImage));
        expect($('.form-label.su-label-gender option[value=' + gender + '][selected]').length > 0).to.be.true;
        var regex = new RegExp(userName);
        expect(regex.test($('.su-cover-url').text())).to.be.true;
        done();
      });
    });

    it('should give an error if no parameters is provided', function(done) {
      request(server)
        .post('/signup')
        .end(function(err, res) {
          var res = JSON.parse(res.text);
          expect(!!res.error).to.be.true;
          done();
        });
    });

    it('should not give an error if firstname, lastname, email, password, ' +
       'gender and birthdate is provided', function(done) {

        var data = {
          fullname   : 'Tingan Ho',
          email      : 'tingan87@gmail.com',
          password   : 'helloworld',
          gender     : 'male',
          date  : '1987-11-23'
        }

        request(server)
          .post('/signup')
          .send(data)
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            done();
          });
    });

    var form = {
      fullname : 'Tingan Ho',
      gender   : 'male',
      date     : '1987-11-25',
      password : 'Tinganisbest',
      email    : 'tingan87@gmail.com'
    }
    it('should give feedback on names smaller than 2 characters long', function(done) {

      Browser.visit("http://localhost:" + server.get('port') + '/step1', { silent: true}, function (e, browser) {
        browser
          .fill('fullname', 'a')
          .fill('password', form.password)
          .fill('email', form.email)
          .fill('.js-signup-date', form.date)
          .select('gender', form.gender, function() {
            browser.pressButton('Join now', function() {
              expect(browser.text('.js-signup-error-message')).to.have.string('At least 2 charracters long');
              done();
            });
          })
      });
    });

    it('should give feedback if user forgets to type in gender', function(done) {
      Browser.visit("http://localhost:" + server.get('port') + '/step1', { silent: true}, function (e, browser) {
        browser
          .fill('fullname', form.fullname)
          .fill('password', form.password)
          .fill('email', form.email)
          .fill('date', form.date)
          .select('gender', '-')
          .pressButton('Join now', function() {
            expect(browser.text('.js-signup-error-message')).to.have.string('Please fill in your gender');
            done();
          });
      });
    });

    it('should give feedback if user forgets to type in birth date', function(done) {
      Browser.visit("http://localhost:" + server.get('port') + '/step1', { silent: true}, function (e, browser) {
        browser
          .fill('fullname', form.fullname)
          .fill('password', form.password)
          .fill('email', form.email)
          .select('gender', form.gender)
          .pressButton('Join now', function() {
            expect(browser.text('.js-signup-error-message')).to.have.string('Please fill in you birth date');
            done();
          });
      });
    });

    it('should give feedback if user types in wrong email', function(done) {
      Browser.visit("http://localhost:" + server.get('port') + '/step1', { silent: true}, function (e, browser) {
        browser
          .fill('fullname', form.fullname)
          .fill('password', form.password)
          .fill('email', 'tingan')
          .fill('date', form.date)
          .select('gender', form.gender)
          .pressButton('Join now', function() {
            expect(browser.text('.js-signup-error-message')).to.have.string('Please fill in your email correctly');
            done();
          });
      });
    });

    it('should give feedback if user types in wrong password', function(done) {
      Browser.visit("http://localhost:" + server.get('port') + '/step1', { silent: true}, function (e, browser) {
        browser
          .fill('fullname', form.fullname)
          .fill('password', 'lol')
          .fill('email', form.email)
          .fill('date', form.date)
          .select('gender', form.gender)
          .pressButton('Join now', function() {
            expect(browser.text('.js-signup-error-message')).to.have.string('Please fill in at least a 6 charracters long password');
            done();
          });
      });
    });

    it('should give feedback if user types wrong in more than one field', function(done) {
      Browser.visit("http://localhost:" + server.get('port') + '/step1', { silent: true}, function (e, browser) {
        browser
          .fill('fullname', form.fullname)
          .fill('password', 'lol')
          .fill('email', 'lol')
          .fill('date', form.date)
          .select('gender', form.gender)
          .pressButton('Join now', function() {
            expect(browser.text('.js-signup-error-message')).to.have.string('Please correct the errors in the form above.');
            done();
          });
      });
    });
  });
};
