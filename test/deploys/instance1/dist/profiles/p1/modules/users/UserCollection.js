
/** 

  @todo Documentation
  @description 

*/

define([

  'backbone',
  './UserModel'

], function( Backbone, UserModel ) {

  'use strict';

  var UserCollection = Backbone.Collection.extend({

    model       : UserModel,
    _offset     : 0,
    _total      : null,

    initialize : function() {

      _.bindAll( this, 'handleSuccess', 'url' );

    },

    /**
    * @description Constructs the url depending on the current offset 
    */

    url     : function() {

      return 'users?filter=recommended&offset=' + this._offset + '&limit=20';

    },


    /**
    * @description Adding success and error callback when fetching data
    */

    fetch   : function( options ) {

      var options = options || {};

      options.success = this.handleSuccess;
      options.error = this.handleError;

      return Backbone.Collection.prototype.fetch.call( this, options ); 

    },

    /**
    * @description Redefines parse function as the user collection is not at the root
    */

    parse   : function( response ) {

      return response.data.users;

    },

    /**
    * @description Handles pagination after a successful API call
    */

    handleSuccess : function( stuff, response, xhr ) {

      this._offset += response.offset + response.limit;
      this._total = response._total;

    },

    handleError : function( response, status, xhr ) {

      console.log( status );

    },

    /**
    * @description Returns the users that are bound to a specfic third-party service
    * such as Wwibo
    */

    byService : function( service ) {

      if( ! service ) {

        return this.models;

      }

      return this.where({ service : service });

    }

  });

  return UserCollection;

});
