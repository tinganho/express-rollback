define(function(require) {

  /**
   * @name Validate
   * @class Validate
   * @constructor
   */
  var Validate = function() {
    this.regex = {
      email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }
  };

  /**
   * Validate fullName
   * @name Validate#fullName
   * @function
   *
   * @param {String} fullName
   */
  Validate.prototype.fullName = function(fullName) {
    if(fullName.length >= 2) {
      return true;
    }
    return false;
  };

  /**
   * Validate email
   * @name Validate#email
   * @function
   *
   * @param {String} email
   */
  Validate.prototype.email = function(email) {
    return this.regex.email.test(email);
  };

  /**
   * Validate password
   * @name Validate#password
   * @function
   *
   * @param {String} password
   */
  Validate.prototype.password = function(password) {
    if(password.length > 6) {
      return true;
    }
    return false;
  };

  /**
   * Validate day
   * @name Validate#day
   * @function
   *
   * @param {Number} day
   */
  Validate.prototype.day = function(day, month) {
    if(month < 1 && month > 12) {
      return false;
    }
    var longMonth = {
      '1' : '',
      '3' : '',
      '5' : '',
      '7' : '',
      '8' : '',
      '10': '',
      '12': ''
    }
    if(month in longMonth) {
      return day >= 1 && day <= 31;
    } else if(month === '2') {
      return day >= 1 && day <= 29;
    } else {
      return day >= 1 && day <= 30;
    }
  };

  /**
   * Validate month
   * @name Validate#month
   * @function
   *
   * @param {Number} month
   */
  Validate.prototype.month = function(month) {
    return month >= 1 && month <= 12;
  };

  /**
   * Validate year
   * @name Validate#year
   * @function
   *
   * @param {Number} year
   */
  Validate.prototype.year = function(year) {
    return year >= 1900 && year <= (new Date()).getFullYear();
  };

  /**
   * Validate date
   * @name Validate#date
   * @function
   *
   * @param {String} date
   */
  Validate.prototype.date = function(date) {
    return /\d{4}-\d{1,2}-\d{1,2}/.test(date);
  };

  /**
   * Validate date
   * @name Validate#date
   * @function
   *
   * @param {Object} thumbNail
   */
  Validate.prototype.thumbNail = function(thumbNail) {
    if(typeof thumbNail !== 'object') {
      return false;
    }
    if(!('type' in thumbNail)) {
      return false;
    }
    if(!('data' in thumbNail)) {
      return false;
    }
    return true;
  };


  return Validate;
});
