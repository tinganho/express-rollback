// Require
var requirejs     = require( 'requirejs' ),

    // RequireJS
    globals       = requirejs( 'profiles/p1/lib/constants/globals' ),
    tmpl          = requirejs( globals.TEMPLATES ),
    gt            = requirejs( globals.TRANSLATION );

// Define API
var routes = function( app ) {

  var loginPage = tmpl[ 'login-page' ]({

  });

  var loginHTML = tmpl[ 'login-layout' ]({

    title           : 'Welcome to P1',
    page            : loginPage

  });

  app.get( '/', function( req, res ) {

    if( req.cookies.access_token ) {

      return res.redirect( 'http://www.p1.com/home/' );

    }

    return res.send( loginHTML );

  });

};

module.exports = routes;
