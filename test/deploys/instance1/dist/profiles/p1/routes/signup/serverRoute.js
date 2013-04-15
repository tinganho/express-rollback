var requirejs = require('requirejs'),
    globals   = requirejs('profiles/p1/lib/constants/globals'),
    tmpl      = requirejs(globals.TEMPLATES),
    gt        = requirejs(globals.TRANSLATION),
    http      = require('http'),
    request   = require('superagent'),
    fs        = require('fs'),
    FormData  = require('form-data'),
    mime      = require('mime'),
    request   = require('request'),
    url       = require('url'),
    gm        = require('gm');

// Define API
var routes = function( app ) {

  app.get( '/step1', function( req, res ) {

    var signup_1_html = tmpl[ 'login-shell' ]({


    title   : 'Enter your informations',
    module  : tmpl[ 'signup' ]({

        full_name          : req.query.full_name || '',
        user_name          : req.query.user_name,
        weibo_uid          : req.query.weibo_uid,
        gender             : req.query.gender,
        profile_image      : req.query.profile_image,
        profile_image_data : req.query.profile_image ? JSON.stringify({type: 'prefilled', data:{ src: req.query.profile_image}}) : '',
        // Help text
        help      : {
          title   : '',
          content : ''
        }

      })
    });
    return res.send( signup_1_html );

  });

  app.post('/signup', function(req, res) {

    // Basic validation
    if(!req.body.fullname
    || !req.body.email
    || !req.body.password) {
      res.statusCode = 400;
      var body = {
        error   : 'Bad input parameter',
        message : 'You must provide at least fullname, email and password in your request'
      }
      res.send(JSON.stringify(body));
      return false;
    }

    // Append form data
    var form = new FormData();
    form.append('first_name', req.body.fullname);
    form.append('last_name', 'ho');
    form.append('gender', 'male');
    form.append('email', req.body.email);
    form.append('password', req.body.password);
    if(req.body['weibo-uid']) {
      form.append('weibo_uid', req.body['weibo-uid']);
    }
    if(req.body.date) {
      form.append('birthday', req.body.date);
    } else if(req.body.year && req.body.month && req.body.day) {
      form.append('birthday', req.body.year + '-' + req.body.month + '-' + req.body.day);
    } else {
      res.statusCode = 400;
      var body = {
        error   : 'Bad input parameter',
        message : 'You must provide a birthdate'
      }
      res.send(JSON.stringify(body));
      return false;
    }

    // Profile image
    if(req.body['profile-image'] && req.body['profile-image'] !== '') {
      try {
        var thumbNail = JSON.parse(req.body['profile-image']);
      } catch(e) {
        _res.on('error', function(){
          res.statusCode = 400;
          res.send(JSON.stringify({
            'error'   : 'ThumbNailParsingError',
            'message' : 'Something went wrong with parsing your thumbnail data'
          }));
        });
      };

      if(thumbNail.type === 'canvas') {
        var src = app.get('root') + '/' + globals.TMP_FILES + '/' + process.env.P1_SERVER_NAME + '-' + (new Date()).getTime() + '.png';
        // Saving to disk is just a temporary solution :(
        // since formData doesn't support other streams
        fs.writeFile(
          src,
          thumbNail.data.src.replace(/^data:image\/png;base64,/,''),
          'base64',
          function(err) {
            form.append('profile_picture', fs.createReadStream(src));
            submit(form);
          }
        );
      } else if(thumbNail.type === 'regular') {
        var src = app.get('root') + url.parse(thumbNail.data.src).pathname;
        form.append('profile_image', fs.createReadStream(src));
        if(thumbNail.type === 'regular') {
          form.append('profile_cropping', JSON.stringify(thumbNail.data.crop));
        }
        submit(form);
      } else if(thumbNail.type === 'prefilled') {
        form.append('profile_image', request(thumbNail.data.src));
        if(thumbNail.type === 'regular') {
          form.append('profile_cropping', thumbNail.data.crop);
        }
        submit(form);
      }
    } else {
      submit(form);
    }

    function submit(form) {
      form.submit({
        host: globals.ACCOUNTS + '.' + globals.DOMAIN,
        path: '/v1/signup/weibo',
        auth: app.get('clientId') + ':' + app.get('clientSecret')
      }, function(err, _res) {
        if(err) {
          res.statusCode = 400;
          var body = {
            error   : 'TypeError',
            message : 'Something wrong in the backend'
          }
          res.send(JSON.stringify(body));
        }
        var body = '';

        _res.on('data', function(chunk) {
          body += chunk;
        });

        _res.on('end', function() {
          if(!validate(body)) {
            // res.statusCode = 400;
          }
          res.send(body);
        });

        _res.on('error', function(){
          // res.statusCode = 400;
          res.send(body);
        });

      });
    }


    function validate(res, err) {
      try {
        var res = JSON.parse(res);
      } catch(e) {
        console.log(e)
        return false;
      }

      if(!('access_token' in res)) {
          return false;
        }
        if(!('user_id' in res)) {
          return false;
        }
        if(!('session_key' in res)) {
          return false;
        }
        if(!('token_type' in res)) {
          return false;
        }
        if(!('expires_in' in res)) {
          return false;
        }
        return true;
    };
  });

  app.get( '/step2', function( req, res ) {

    return res.send( signup_1_html );

  });


};

module.exports = routes;
