if( typeof define != 'function' ) {
  var define = require( 'amdefine' )( module );
}

define(function(require) {

  var E = require('./errors');
  /**
   * @name Http
   * @class Http
   * @constructor
   */
  var Http = function() {};

  /**
   * Validates a HTTP response JSON
   * @name Http#validate
   * @function
   *
   * @param {String} res The response of the HTTP request
   * @param {Object} prop An object containing all the properties
   * the response should have
   */
  Http.prototype.validateRawResponse = function(res, prop) {

    var prop = prop || {};

    try {
      JSON.parse(res);
    } catch(e){
      throw new E.WrongJSONFormatError();
    };

    for(var i in prop) {
      if(!prop.hasOwnProperty(i)) {
        continue;
      }
      if(!prop[i]) {
        throw new E.WrongJSONResponseError();
      }
    }
  }

  /**
   * Get query string for use in HTTP GET request
   * @name Http#getQueryString
   * @function
   *
   * @param {Object} obj Containing all keys and values
   * @return a HTTP query string
   */
  Http.prototype.getQueryString = function(obj) {
    if(typeof obj !== 'object') {
      throw new E.NotAnObjectLiteralError();
    }

    var str = '?';
    var n = 0;
    for(var i in obj) {
      if(n !== 0) {
        str += '&'
      }
      str += i + '=' + obj[i];
      n++;
    }

    return str;

  }

  return Http;

});
