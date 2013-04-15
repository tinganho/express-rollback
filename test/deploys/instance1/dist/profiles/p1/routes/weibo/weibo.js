

var requirejs   = require('requirejs'),
    Http        = requirejs('profiles/p1/lib/js/http'),
    querystring = require('querystring'),
    https       = require('https'),
    E           = requirejs('profiles/p1/lib/js/errors'),
    request     = require('superagent'),
    globals     = requirejs('profiles/p1/lib/constants/globals');


/**
 * @constructor Weibo
 */

var Weibo = function(){

  Http.apply(this);

  this.hostname = 'api.weibo.com';

  this.auth = {
    appkey: '1355421978',
    secret: '7d1e6efa431b1a2d2acf97c694cf02d9',
    oauthCallbackUrl: 'http://127.0.0.1/weibo-access-token'
  }

  this.data = {
    client_id: this.auth.appkey,
    client_secret: this.auth.secret,
    grant_type: 'authorization_code',
    code: null,
    redirect_uri: this.auth.oauthCallbackUrl
  };

  this.dataUrlEncoded = null;

  this.path = {
    show_user: '2/users/show.json'
  };

  this.options = {
    host: 'api.weibo.com',
    port: 443,
    path: '/oauth2/access_token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': this.data.length
    }
  };

}

Weibo.prototype.constructor = new Http();
Weibo.prototype = Http.prototype;

/**
 * Get user information
 * @param {Number} uid
 * @param {String} access_token
 */
Weibo.prototype.getUserInfo = function(uid, accessToken, cb, err) {
  var _this = this,
        err = err || function() {};

  var url ='https://' + this.hostname + '/' +  this.path.show_user + this.getQueryString({
    uid: uid,
    access_token: accessToken,
    appkey: this.auth.appkey
  });
  https.get(url, function(res, req) {
    res.setEncoding('utf8');
    res.on('data', function (raw) {
      try {
        _this.validateRawResponse(raw);
        user = JSON.parse(raw);
        _this.validateWeiboUserResponse(user);
        cb(user);
      } catch(e) {
        err(e.name, e.message);
      }
    });
  });
}

/**
 * Get user information
 * @param {String} uid
 * @param {String} access_token
 */
Weibo.prototype.setData = function(key, value) {
  this.data[key] = value;
  this.dataUrlEncoded = querystring.stringify(this.data);
  this.options.headers['Content-Length'] = this.dataUrlEncoded.length;
}

/**
 * Get Weibo Access Token, Async call
 * @param {Object} res
 * @param {Function} cb A callback function
 */
Weibo.prototype.getAccessToken = function(cb, err) {
  var _this = this,
        err = err || function() {};

  var weiboReq = https.request(this.options, function(_res) {

    _res.setEncoding('utf8');
    _res.on('data', function (raw) {
      try {
        _this.validateRawResponse(raw);
        res = JSON.parse(raw);
        _this.validateWeiboData(res);
        cb(res.uid, res.access_token);
      } catch(e) {
        err(e.name, e.message);
      };
    });
  });
  weiboReq.write(this.dataUrlEncoded);
  weiboReq.end();
}

/**
 * Validates Weibo data
 * @param {Object} data
 */
Weibo.prototype.validateWeiboData = function(data) {
  if(('error' in data)) {
    throw new E.HTTPResponseError(JSON.stringify(data));
  }
  return true;
}

/**
 * Validates Weibo user response
 * @param {Object} data
 */
Weibo.prototype.validateWeiboUserResponse = function(data) {
  if(!('id' in data)) {
    throw new E.HTTPResponseError(JSON.stringify(data));
  }
  return true;
}

/**
 * Validates Weibo user response
 * @param {Object} data
 */
Weibo.prototype.storeAccessToken = function(accessToken, authorization, cb) {
  request
  .post('http://' + globals.ACCOUNTS + '.' + globals.DOMAIN +  '/v1/signup/weibo/access-token')
  .send({ access_token: accessToken})
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .set('Authorization', authorization)
  .end(function(err, res){
    cb(err, res);
  });
}


module.exports = Weibo;

