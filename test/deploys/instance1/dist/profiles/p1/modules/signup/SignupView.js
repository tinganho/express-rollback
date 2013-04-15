
/**

  @todo Documentation
  @description This view handles common interaction with both
  Signup steps

  @todo Handle helper text

*/

define([

  'profiles/p1/routes/P1.Router',
  'backbone',
  'jquery',
  'public/templates/tmpl',
  'profiles/p1/lib/constants/globals',
  './SignupProfileView',
  './SignupFriendsView',
  './SignupHelpView',
  'profiles/p1/routes/signup/SignupController'

], function( Router, Backbone, $, tmpl, globals, SignupProfileView, SignupFriendsView, SignupHelpView, SignupController ) {

  'use strict';

  var SignupView = Backbone.View.extend({

  	template	: tmpl[ 'signup' ],
    el        : '.login-wrapper',
    boundSignupController : false,

    initialize	: function() {

      this.helpType = 'default';

      this.SignupHelpView = new SignupHelpView({});
      this.SignupProfileView = new SignupProfileView({});
      this.SignupFriendsView = new SignupFriendsView({});

      var view = this;

      Router.Signup.on( 'route', function( route, param ) {

        view.showHelp( route );

      });

      if(!this.boundSignupController) {
        SignupController();
        this.boundSignupController = true;
      }

    },

    render		: function() {

      var signupHTML = this.template({

        calendar  : Modernizr.inputtypes.date,
        help      : this.SignupHelpView.collection.where( { type : 'step1' } )[0].toJSON()

      });

      this.$el.html( signupHTML );

      this.SignupProfileView.setElement( '.su-step1' );
      this.SignupFriendsView.setElement( '.su-step2' );
      this.SignupFriendsView.addAll();

      if(!this.boundSignupController) {
        SignupController();
        this.boundSignupController = true;
      }
      this.SignupFriendsView.addAll();

    	return this;

    },

    events    : {

      'focus .js-signup-help' : 'catchHelp',
      'mouseover .su-upload' : 'catchHelp'

    },

    catchHelp : function( event ) {

      var type = ( event.target.dataset ) ? event.target.dataset.help : event.target.getAttribute( 'help' );

      if( type === this.helpType ) {

        return;

      }

      this.showHelp( type );

    },

    showHelp : function ( type ) {

      this.helpType = type;
      this.$el.find( '.su-help' ).replaceWith( this.SignupHelpView.render( type ).el );

    }

  });

  return SignupView;

});
