
/** 

  @todo Documentation
  @description 

*/

define([

  'backbone'

], function( Backbone ) {

  'use strict';

  var UserModel = Backbone.Model.extend({

  	initialize : function( attributes ) {

  		// Handles the type of button
  		this.set( '_type', 'invite' );
  		this.set( '_fullname', attributes.name[ attributes.name.preferred ].fullname );

  	}

  });

  return UserModel

});
