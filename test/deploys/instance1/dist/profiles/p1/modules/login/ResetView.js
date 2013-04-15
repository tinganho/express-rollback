
/** 

  @todo Documentation
  @description This view handles the login page, shows the login popin,
  and handles the weibo signup button

*/
define([

  '../../routes/P1.Router',
  'backbone',
  'jquery',
  'public/templates/tmpl',
  'profiles/p1/lib/constants/globals'

], function( Router, Backbone, $, tmpl, globals ) {

  'use strict';

  var ResetView = Backbone.View.extend({

    el        : '.reset-page',

    intialize	: function() {

    },

    events    : {

      'submit .js-reset-form' : 'submitReset'

    },

    submitReset : function( event ) {

      event.preventDefault();

      var $form = $( event.target );

      if( ! event.target.password.value ) {

        alert( 'Empty password' );

      }

      if( event.target.password.value !== event.target.password_confirm.value ) {

        alert( 'Stuff does not match' );

        return;

      }

      $.post( event.target.action, $form.serialize() )
      .done( function( response ) {

        //@todo : handle errors

        if( response.error ) {

          alert( response.error );
          return;

        }

        Router.Login.navigate( 'login', { trigger : true });

      });

    }

  });

  return ResetView;

});
