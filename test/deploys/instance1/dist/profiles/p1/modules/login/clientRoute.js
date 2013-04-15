
/*global document */

define([

  'profiles/p1/routes/P1.Router',
  'backbone',
  'jquery',
  'profiles/p1/modules/login/LoginView'

], function( Router, Backbone, $, LoginView ) {

  'use strict';

  var RouterLogin = Backbone.Router.extend({

    routes      : {

      'login'           : 'login',
      'forgot-password' : 'forgot_password',
      'reset-password'  : 'reset_password'

    },

    login       : function() {

      if( ! this.view ) {

        // this.view = new LoginView;

      }

      var $login_page = $( '.login-page' )

      if( ! $login_page.length ) {

        this.view.render();

      }


    },

    forgot_password : function() {

      if( ! this.view ) {

        // this.view = new LoginView;

      }

      var $login_page = $( '.login-page' )

      if( ! $login_page.length ) {

        this.view.render({

          lsClass   : 'ls-forgot'

        });

      }

    },

    reset_password  : function() {

      requirejs( [ 'profiles/p1/modules/login/resetView' ], function( resetView ) {

        var reset = new resetView({

          el    : '.reset-page'

        });

      });

    }

  });

  return RouterLogin;

});
