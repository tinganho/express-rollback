require.config({

  paths: {

    'lodash'        : 'vendor/lodash/lodash',
    'backbone'      : 'vendor/backbone/backbone',
    'jquery'        : 'vendor/jquery/jquery',
    'tmpl'          : 'public/templates/tmpl',
    'globals'       : 'profiles/p1/lib/constants/globals'

  },

  shim: {

    'lodash' : {
      exports : '_'
    },

    'backbone': {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    },

    'jquery': {
      exports: 'jQuery'
    }
  }

});
// Define a module modernizr
define('modernizr', [], function() {
  return Modernizr;
});

// Define the P1 namespace
var P1 = {};
define( 'P1', [], function() {
  return window.P1;
});


define('expect', [], function() {
  return expect;
});

// Require all libraries
require([
  'jquery',
  'profiles/p1/lib/constants/globals',
  'profiles/p1/app',
  'profiles/p1/routes/P1.Router',
  'profiles/p1/modules/login/clientRoute',
  'profiles/p1/modules/signup/clientRoute',
  'modernizr'

], function( $, globals, app, Router, LoginRouter, SignupRoute, Modernizr ) {
  $(function() {
    // Set all routers before Backbone start
    Router.Login = new LoginRouter();
    Router.Signup = new SignupRoute();

    /**
    * General config for API calls
    * Possible pitfalls : Authorization token not present, weird API routes
    */
    app.init();

    // Enable pushState for compatible browsers
    var enablePushState = true;

    // Disable for older browsers
    var pushState = !!(enablePushState && window.history && window.history.pushState);

    Backbone.history.start({ pushState: pushState });

    var _sync = Backbone.sync;

    Backbone.sync = function( method, model, options ) {

      options.beforeSend = function( xhr ) {

        xhr.setRequestHeader( 'Content-Type', 'text/plain' );
        xhr.withCredentials = true;

      };

      _sync( method, model, options );

    };

    Backbone.ajax = function( request ) {

      request.url = 'http://' + globals.API + '.' + globals.DOMAIN + '/' + globals.VERSION + '/' + globals.CORE + '/' + request.url + '&access_token=debf3a72083486bb49c6b08a7ad1d2f500736411';
      request.crossDomain = true;

      return Backbone.$.ajax.apply( Backbone.$, arguments );

    };

    if(!Modernizr.inputtypes.date) {
      document.getElementsByTagName('html')[0].className += ' no-dateinput';
    }
  })

});

