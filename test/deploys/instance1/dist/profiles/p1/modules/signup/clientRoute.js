
/*global document */

define([

  '../../routes/P1.Router',
  'backbone',
  'jquery',
  './SignupView'

], function( Router, Backbone, $, SignupView ) {

  'use strict';

  var $body = $( document.body );

  var RouterSignup = Backbone.Router.extend({

    routes      : {

      'step1'     : 'step1',
      'step2'     : 'step2'

    },

    step1       : function() {

      //@todo handle legacy browsers
      //if( ! Modernizr.csstransitions ) -> call callback immeditalery
      //else -> attach transition event and call callback
      //If there's enough time, write a small library to abstract it

      if( ! this.view ) {

        // this.view = new SignupView({});
        // SignupView is called twice

      }


      var $signup_wrapper = $( '.signup-wrapper' );

      if( $signup_wrapper.length ) {

        $signup_wrapper.removeClass( 'su-step2-active' );

      }
      else {

        var $login_wrapper = $( '.login-wrapper' ),
            view = this.view;

        $login_wrapper.on( 'webkitTransitionEnd', function( event ) {

          $login_wrapper.off( event );

          view.render({});
          $body.removeClass( 'page-transition' );

        });

        $body.addClass( 'page-transition' );

      }

    },

    step2       : function() {

      // Logic to handle the unlikely case where
      // step1 would not be the previous view
      // i.e Hitting the back button

      if( ! this.view ) {

        this.view = new SignupView({});

      }

      var $signup_wrapper = $( '.signup-wrapper' )

      if( $signup_wrapper.length ) {

        $signup_wrapper.addClass( 'su-step2-active' );

      }
      else {

        this.view.render();

      }
    }

  });


  return RouterSignup;

});
