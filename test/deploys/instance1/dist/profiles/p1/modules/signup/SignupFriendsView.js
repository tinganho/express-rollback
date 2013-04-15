
/**

  @todo Documentation
  @description This view handles the signup friends interactions
  The friend list itself will be another subview

*/

define([

  'profiles/p1/routes/P1.Router',
  'backbone',
  'jquery',
  'public/templates/tmpl',
  'profiles/p1/lib/constants/globals',
  '../users/UserView',
  '../users/UserCollection'

], function( Router, Backbone, $, tmpl, globals, UserView, UserCollection ) {

  'use strict';

  // Dumb data
  // Need to check API call and bind to proper data and to the API

  var Users = new UserCollection;

  var SignupFriendsView = Backbone.View.extend({

  	template	: tmpl[ 'signup-friends' ],
    collection  : Users,

    el        : '.su-step2',

    initialize	: function() {

    	_.bindAll( this, 'render', 'addOne', 'addAll', 'filterByService' );

      this.collection.on( 'add', this.addOne );
      this.collection.on( 'reset', this.addAll );

      this._service = ''; // All suggestions are shown
      // this.addAll(); // To be replaced by this.collection.fetch();
      this.collection.fetch();

    },

    render : function() {

      // Nothing specific yet

    },

    events      : {

      'click .su-service'   : 'filterByService'

    },

    addOne  : function( user ) {

      var userView = new UserView({ model : user });

      // If the user is from a different service than the on currently shown
      // It is not added to the list
      if( this._service && this._service !== userView.get( 'service' ) ) {

        return;

      }

      this.$friendList.append( userView.render().el );


    },

    addAll  : function() {

      if( ! this.$friendList || ! this.$friendList[0] ) {

        this.$friendList = this.$( '.friend-list' );

      }

      this.collection.each( this.addOne, this );

    },

    /**
    * @description Preliminary logic to filter users by service they were imported from
    */

    filterByService  : function( event ) {

      var $target = $( event.currentTarget ), service, users;

      if( $target.hasClass( 'sp-active' ) ) {

        return;

      }

      this.$( '.sp-active' ).removeClass( 'sp-active' );
      $target.addClass( 'sp-active' );

      service = $target.data( 'service' );
      users   = this.collection.byService( service );

      this.$friendList.empty();
      _.each( users, this.addOne, this );

    }

  });

  return SignupFriendsView;

});
