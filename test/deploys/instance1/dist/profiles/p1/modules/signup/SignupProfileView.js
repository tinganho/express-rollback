
/**

  @todo Documentation
  @description This view handles the signup profile interactions

  @todo Integrate picture cropping module
  @todo

*/

define([

  '../../routes/P1.Router',
  'backbone',
  'jquery',
  'lodash',
  'public/templates/tmpl',
  'profiles/p1/lib/constants/globals',
  'profiles/p1/lib/js/file',
  'profiles/p1/lib/js/backoverlay',
  'profiles/p1/modules/modal/modal',
  'profiles/p1/lib/js/validate',
  './SignupFormModel',
  'modernizr',
  '../module'

], function( Router, Backbone, $, _, tmpl, globals, File, Backoverlay, Modal, Validate, SignupFormModel, Modernizr, Module) {

  'use strict';

  /**
   * @name SignupProfileView
   * @class SignupProfileView
   * @constructor
   */
  var SignupProfileView = Backbone.View.extend(_.extend({

  	template	: tmpl[ 'signup-profile' ],
    el        : '.su-step1',


    initialize : function() {

      this.model = new SignupFormModel();

      this.model.on({
        'change' : this.updateFeedback
      }, this);

      this.validate          = new Validate();
      this.signupForm        = this.$('.js-signup-form');
      this.fullNameInput     = this.$('.js-signup-fullname');
      this.coverName         = this.$('.js-cover-name');
      this.emailInput        = this.$('.js-signup-email');
      this.genderInput       = this.$('.js-signup-gender');
      this.passwordInput     = this.$('.js-signup-password');
      this.thumbNailInput    = this.$('.js-signup-thumbnail');
      this.feedbackLabel     = this.$('.js-signup-error-message')
      this.feedbackLabelText = this.$('.js-signup-error-message-text');

      this.dayInput   = this.$('.js-signup-day');
      this.monthInput = this.$('.js-signup-month');
      this.yearInput  = this.$('.js-signup-year');
      this.dateInput  = this.$('.js-signup-date');


      if(Modernizr.sessionstorage) {
        this.prefillInputs();
      }

    },

    events : {
      'click  .js-step1-submit'    : 'submit',
      'click  .js-step1-quit'      : 'quit',
      'click  .js-step1-terms'     : 'terms',
      'click  .js-step1-privacy'   : 'privacy',
      'blur   .js-signup-fullname' : 'validateFullname',
      'keyup  .js-signup-fullname' : 'replicateFullname',
      'blur   .js-signup-email'    : 'validateEmail',
      'blur   .js-signup-password' : 'validatePassword',
      'change .js-signup-gender'   : 'validateGender',

      // Dates
      'blur  .js-signup-month'    : 'validateMonth',
      'blur  .js-signup-day'      : 'validateDay',
      'blur  .js-signup-year'     : 'validateYear',
      'blur  .js-signup-date'     : 'validateDate'
    },

    replicateFullname : function() {
      this.coverName.html(this.fullNameInput.val());
    },

    prefillInputs: function() {
      var fullname = sessionStorage.getItem('fullname');
      if(fullname) {
        this.fullNameInput.val(fullname);
        this.coverName.html(fullname);
      }
      var email = sessionStorage.getItem('email');
      if(email) {
        this.emailInput.val(email);
      }
      var gender = sessionStorage.getItem('gender');
      if(gender) {
        this.genderInput.val(gender);
      }
      var year = sessionStorage.getItem('year');
      if(year) {
        this.yearInput.val(year);
      }
      var month = sessionStorage.getItem('month');
      if(month) {
        this.monthInput.val(month);
      }
      var day = sessionStorage.getItem('day');
      if(day) {
        this.dayInput.val(day);
      }
    },

    validateFullname : function() {
      var val = this.fullNameInput.val();
      if(!this.validate.fullName(val)) {
        this.fullNameInput.addClass('error');
        this.model.set('fullNameError', true);
        return false;
      } else {
        this.fullNameInput.removeClass('error');
        if(Modernizr.sessionstorage) {
          sessionStorage.setItem('fullname', val);
        }
        this.model.unset('fullNameError');
        return true;
      }
    },

    validateEmail : function() {
      var val = this.emailInput.val();
      if(!this.validate.email(val)) {
        this.emailInput.addClass('error');
        this.model.set('emailError', true);
        return false;
      } else {
        if(Modernizr.sessionstorage) {
          sessionStorage.setItem('email', val);
        }
        this.model.unset('emailError');
        this.emailInput.removeClass('error');
        return true;
      }
    },

    validateYear : function() {
      var val = this.yearInput.val();
      if(!this.validate.year(this.yearInput.val())) {
        this.yearInput.addClass('error');
        this.model.set('yearError', true);
        return false;
      } else {
        if(Modernizr.sessionstorage) {
          sessionStorage.setItem('year', val);
        }
        this.model.unset('yearError');
        this.yearInput.removeClass('error');
        return true;
      }
    },

    validateMonth : function() {
      var val = this.monthInput.val();
      if(!this.validate.month(this.monthInput.val())) {
        this.monthInput.addClass('error');
        this.model.set('monthError', true);
        return false;
      } else {
        if(Modernizr.sessionstorage) {
          sessionStorage.setItem('month', val);
        }
        this.model.unset('monthError');
        this.monthInput.removeClass('error');
        return true;
      }
    },

    validateDay : function() {
      var val = this.dayInput.val();
      var month = this.monthInput.val();
      if(!this.validate.day(val, month)) {
        this.dayInput.addClass('error');
        this.model.set('dayError', true);
        return false;
      } else {
        if(Modernizr.sessionstorage) {
          sessionStorage.setItem('day', val);
        }
        this.model.unset('dayError');
        this.dayInput.removeClass('error');
        return true;
      }
    },

    validateDate : function() {
      if(this.dateInput.length === 0) {
        this.model.unset('dateError');
        return true;
      }
      var val = this.dateInput.val();
      if(val.length === 0) {
        this.dateInput.addClass('error');
        this.model.set('dateError', true);
        return false;
      }
      if(!this.validate.date(this.dateInput.val())) {
        this.dateInput.addClass('error');
        this.model.set('dateError', true);
        return false;
      } else {
        this.dateInput.removeClass('error');
        this.model.unset('dateError');
        return true;
      }
    },

    validateGender : function() {
      var val = this.genderInput.val();
      if(this.isArray(val)) {
        val = val[0];
      }
      if(val !== 'male' && val !== 'female') {
        this.genderInput.addClass('error');
        this.model.set('genderError', true);
        return false;
      } else {
        this.genderInput.removeClass('error');
        this.model.unset('genderError');
        return true;
      }
    },

    validatePassword : function() {
      if(!this.validate.password(this.passwordInput.val())) {
        this.passwordInput.addClass('error');
        this.model.set('passwordError', true);
        return false;
      } else {
        this.passwordInput.removeClass('error');
        this.model.unset('passwordError');
        return true;
      }
    },

    validateThumbnail : function() {
      var val = this.thumbNailInput.val()
      if(val.length === 0) {
        return true;
      }
      try {
        var val = JSON.parse(this.thumbNailInput.val());
      } catch(e) {
        return false;
      }
      if(val.length === 0) {
        return true;
      }
      return this.validate.thumbNail(val);
    },

    validateAllInputs : function() {
      var allInputsAreValid = true;

      // We check all inputs regardless if they are wrong or right to mark them red.
      if(!this.validateFullname() && allInputsAreValid) {
        allInputsAreValid = false;
      }
      if(!this.validateEmail() && allInputsAreValid) {
        allInputsAreValid = false;
      }
      if(!this.validatePassword() && allInputsAreValid) {
        allInputsAreValid = false;
      }
      if(!this.validateGender() && allInputsAreValid) {
        allInputsAreValid = false;
      }

      // Date
      if(this.dateInput.css('display') !== 'none') {
        if(!this.validateDate() && allInputsAreValid) {
          allInputsAreValid = false;
        }
      } else {
        if(!this.validateDay() && allInputsAreValid) {
          allInputsAreValid = false;
        }
        if(!this.validateMonth() && allInputsAreValid) {
          allInputsAreValid = false;
        }
        if(!this.validateYear() && allInputsAreValid) {
          allInputsAreValid = false;
        }
      }

      // Thumbnail
      if(!this.validateThumbnail() && allInputsAreValid) {
        allInputsAreValid = false;
      }

      return allInputsAreValid;
    },

    submit : function(e) {

      e.preventDefault();

      if(this.validateAllInputs()) {
        $.post(
          'signup',
          this.signupForm.serialize(),
          function(data, textStatus, jqXHR) {
            try {
              var data = JSON.parse(data)
            } catch(e) {
               Router.Signup.navigate('404', { trigger : true });
            };

            if(data.error) {
              switch(data.error) {
                case 'PROFILE_PICTURE_WIDTH_OR_HEIGHT_TOO_SMALL':
                alert('Your thumbnail picture is too small. It must be at least 180x180 px');
                break;
                case 'FILE_SIZE_EXCEEDS_8MB':
                alert('You used an image that is too large');
                break;
                case 'COULD_NOT_SET_PASSWORD':
                alert('We could not set your password');
                break;
                case 'COULD_NOT_UPDATE_WEIBO_CONNECTION':
                alert('We could not connect your Weibo account');
                break;
                case 'INVALID_WEIBO_UID':
                alert('Your weibo account is already connected to a P1 account');
                break;
                case 'WEIBO_UID_MISSING':
                alert('You must signup using Weibo');
                break;
                case 'INVALID_BIRTHDAY_FORMAT (YYYY-MM-DD)':
                alert('You have typed in an invalid date.');
                break;
              }
            } else if(data.access_token){

            }
          }
        );

      }
       Router.Signup.navigate('step2', { trigger : true });
    },


    updateFeedback : function() {
      var size = _.size(this.model.attributes);
      if(size == 1) {
        this.feedbackLabel.hide();
      } else if(size > 2) {
        this.feedbackLabelText.html('Please correct the errors in the form above.');
        this.feedbackLabel.show();
      } else {
        for(var i in this.model.attributes) {
          if(this.model.attributes[i] === true) {
            this.feedbackLabelText.html(this.model.attributes.feedback[i]);
          }
        }
        this.feedbackLabel.show();
      }
    },

    quit : function() {

      var agree = confirm('Please confirm you want to leave the signup process.');
      if(agree) {
        Router.Signup.navigate( 'login',  { trigger : true } );
      }

    },


    terms : function() {

      alert( 'show terms' );

    },

    privacy : function() {

      alert( 'show privacy' );

    }

  }, Module.prototype));

  return SignupProfileView;

});
