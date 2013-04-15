// change appkey to yours

  var https = require('https'),
      Weibo = require('./weibo'),
querystring = require('querystring');


var routes = function( server ) {
  server.get('/weibo-access-token', function(req, res) {
    var weibo = new Weibo();
    weibo.setData('code', req.query.code);
    weibo.getAccessToken(function(uid, accessToken) {
      weibo.getUserInfo(uid, accessToken, function(user) {
        weibo.storeAccessToken(accessToken, server.get('authorization'), function(err, _res) {
          if(err) {
            console.log(err);
            res.redirect('/404.html');
          } else if(_res.statusCode === 200) {
            res.redirect('/step1?' + querystring.stringify({
              user_name     : user.screen_name,
              weibo_uid     : user.id,
              gender        : user.gender === 'm' ? 'male' : 'female',
              profile_image : user.avatar_large
            }));
          } else if(_res.statusCode === 201) {
            // This will be removed when not under development
            res.redirect('/step1?' + querystring.stringify({
              user_name     : user.screen_name,
              weibo_uid     : user.id,
              gender        : user.gender === 'm' ? 'male' : 'female',
              profile_image : user.avatar_large
            }));
          }
        });
      }, err);
    }, err);

    function err(name, message) {
      console.log((new Date()).toString(), name, message);
      res.redirect('/404.html');
    }
  });
}

module.exports = routes;
