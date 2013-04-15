// Require
var requirejs     = require( 'requirejs' ),

    // RequireJS
    globals       = requirejs( 'profiles/p1/lib/constants/globals' ),
    tmpl          = requirejs( globals.TEMPLATES ),
    gt            = requirejs( globals.TRANSLATION );

// Define API
var routes = function( app ) {

  app.get( '/login', function( req, res ) {

    //@todo remove when we integrate with the old backend

    // if( req.cookies.access_token && req.cookies.session_key ) {

    //   return res.redirect( 'http://' + globals.SERVER_DOMAIN + '/home/' );

    // }

    var html = tmpl[ 'login-shell' ]({

      title           : 'Welcome to P1',
      module          : tmpl[ 'login-page' ]({

        weiboCallbackUrl: globals.WEIBO_CALLBACK_URL

      })

    });

    return res.send( html );

  });

  app.get( '/forgot-password', function( req, res ) {

    var html = tmpl[ 'login-shell' ]({

      title           : 'Welcome to P1',
      bodyClass       : 'ls-show',
      module          : tmpl[ 'login-page' ]({

        weiboCallbackUrl  : globals.WEIBO_CALLBACK_URL,
        lsClass           : 'ls-forgot'


      })

    });

    return res.send( html );

  });

  app.get( '/reset-password', function( req, res ) {

    var html = tmpl[ 'login-shell' ]({

      title           : 'Welcome to P1',
      bodyClass       : 'ls-reset',
      module          : tmpl[ 'reset-page' ]()

    });


    return res.send( html );

  });


};

module.exports = routes;
