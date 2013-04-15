define(function(require) {

  var $ = require('jquery'),
  E = require('profiles/p1/lib/js/errors');


  var op     = Object.prototype,
      ostring = op.toString;



  /**
   * @name Module
   * @class Module
   * @constructor
   */
  function Module() {
    // A module always has a root element
    this.root = null;
  }

  /**
   * Get html
   * @name Module#getHtml
   * @function
   *
   * @param {Object} HTML Object
   * @return {String} HTML String
   */
  Module.prototype.getHTML = function(node) {
    var div = document.createElement('div');
    div.appendChild(node);
    return div.innerHTML;
  }

  /**
   * Is it an object?
   * @name Module#isArray
   * @function
   *
   * @param {Object}
   */
  Module.prototype.isFunction = function(it) {
    return ostring.call(it) === '[object Function]';
  }

  /**
   * Is it an array?
   * @name Module#isArray
   * @function
   *
   * @param {Object}
   */
  Module.prototype.isArray = function(it) {
    return ostring.call(it) === '[object Array]';
  }

  /**
   * Get the standing of an html object
   * @name Module#getHTMLStand
   * @function
   *
   * @param {Object} HTML Object image
   * @return {String} HTML String landscape or portrait
   */
  Module.prototype.getHTMLStand = function(node) {
    return $(node).width() > $(node).height() ? 'landscape' : 'portrait';
  }

  /**
   * Get the int of a string
   * @name Module#getInt
   * @function
   *
   * @param {String} string
   */
  Module.prototype.getInt = function(string) {
    if(typeof string !== 'string') {
      throw new E.WrongTypeInParameterError('string', string);
    }
    if(typeof string.length === 0) {
      throw new TypeError('Length of string can not be zero');
    }
    return parseInt((string.match(/\d+/))[0]);
  }

  /**
   * Throw error
   * @name Module#throwError
   * @function
   *
   * @param {String} name
   */
  Module.prototype.throwError = function(name) {
    throw new E[name]();
  }

  return Module;
});
