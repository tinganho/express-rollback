
/**

  @todo Documentation
  @description This view handles the signup friends interactions
  The friend list itself will be another subview

*/

define([

  '../../routes/P1.Router',
  'backbone',
  'jquery',
  'public/templates/tmpl',
  'profiles/p1/lib/constants/globals',
  './UserModel'

], function( Router, Backbone, $, tmpl, globals, UserModel ) {

  'use strict';

  var UserListView = Backbone.View.extend({

    model     : UserModel,
    template  : tmpl[ 'user' ],

    initialize	: function() {

      _.bindAll( this, 'render', 'addOne', 'filterService' );

    },

    render		: function() {

      this.el = this.template( this.model.toJSON() );
      return this;

    },

    //@todo Implement add as a friend

    addFriend : function() {


    },

    //@todo implement invite friend
    inviteFriend : function() {


    }

  });

  return UserListView;

});
