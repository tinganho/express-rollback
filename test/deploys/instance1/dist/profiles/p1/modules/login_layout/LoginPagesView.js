
/** 

  @todo Documentation
  @description This view handles top level interaction with the login and signup pages
  For now, only the footer fits in there

*/

define([

  '../../routes/P1.Router',
  'backbone',
  'jquery',
  'public/templates/tmpl',
  'profiles/p1/lib/constants/globals'

], function( Router, Backbone, $, tmpl, globals ) {

  'use strict';

  var LoginPagesView = Backbone.View.extend({

  	template	: tmpl[ 'login-page' ],
    el        : '.login',

    intialize	: function() {

    	_.bindAll( this, 'render' );

    },

    render		: function() {

    	this.el = this.template();
    	return this;

    }

  });

  return new LoginView({});

});
