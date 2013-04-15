
/**

  @todo Documentation
  @description This view handles the login page, shows the login popin,
  and handles the weibo signup button

*/
define([

  'profiles/p1/routes/P1.Router',
  'backbone',
  'jquery',
  'public/templates/tmpl',
  'profiles/p1/lib/constants/globals'

], function( Router, Backbone, $, tmpl, globals ) {

  'use strict';

  var LoginView = Backbone.View.extend({

  	template	: tmpl[ 'login-page' ],
    el        : '.login-wrapper',

    intialize	: function() {

    	_.bindAll( this, 'render' );

    },

    render		: function() {

    	this.$el.html( this.template({

        lsClass     : '',
        weiboCallbackUrl : globals.WEIBO_CALLBACK_URL

      }) );
    	return this;

    },

    events    : {

      'click .js-signin-open, .js-signin-close, .login-overlay' : 'toggleSignIn',
      'click .js-signin-weibo' : 'weiboSignIn',
      'click .js-signup-email' : 'emailSignup',
      'click .js-signin-forgot': 'showForgot',
      'click .js-cancel-forgot': 'hideForgot',
      'submit .js-signin-form' : 'authenticate',
      'submit .js-forgot-form' : 'submitForgot'

    },

    toggleSignIn : function() {

      $( document.body ).toggleClass( 'ls-show' );
      this.$( '.ls-forgot' ).removeClass( 'ls-forgot' );

      Router.Login.navigate( 'login' );

    },

    weiboSignIn : function() {

      // Router.Signup.navigate( 'step1', { trigger : true });

    },

    emailSignup : function() {

      Router.Signup.navigate( 'step1', { trigger : true });

    },


    showForgot : function() {

      // In case the page is refreshed
      Router.Login.navigate( 'forgot-password' );
      this.$( '.js-signin' ).addClass( 'ls-forgot' );

    },

    hideForgot : function() {

      Router.Login.navigate( 'login' );
      this.$( '.js-signin' ).removeClass( 'ls-forgot' );
    },

    authenticate : function( event ) {

      var $form = $( event.target );

      $.post( event.target.action, $form.serialize() )
      .done( function( response ) {

        //@todo : handle errors

        if( response.error ) {

          alert( response.error );
          return;

        }

        //@todo : need to be on the same domain to work
        window.location = response.redirect;

      });

      event.preventDefault();

    },

    submitForgot : function( event ) {

      var $form = $( event.target );

      $.post( event.target.action, $form.serialize() )
      .done( function( response ) {

        //@todo : handle errors

        if( response.error ) {

          alert( response.error );
          return;

        }

      });

      event.preventDefault();

    }

  });

  return LoginView;

});
