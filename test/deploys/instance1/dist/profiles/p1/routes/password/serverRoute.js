// Require
var requirejs     = require( 'requirejs' ),

    querystring   = require( 'querystring' ),
    http          = require( 'http' ),
    globals       = requirejs( 'profiles/p1/lib/constants/globals' ),
    gt            = requirejs( globals.TRANSLATION );

// Define API
var routes = function( app ) {

  var options = {

    hostname  : globals.ACCOUNTS + '.' + app.get( 'domain' ),
    port      : globals.ACCOUNTS_PORT,
    method    : 'POST',
    headers   : globals.HEADERS

  };

  /**
  * Submiting the forgot password form with an email
  */

  app.post( '/forgot-password', function( req, res ) {

    var post_data = querystring.stringify({

      'email'    : req.body.email

    });

    options.path = '/' + globals.VERSION + '/' + globals.RESET;
    options.headers[ 'content-length' ] = post_data.length;
    options.headers[ 'Authorization' ] = app.get( 'authorization' );

    var post_req = http.request( options, function( reset_response ) {

      // Setting encoding to get the response as a string
      reset_response.setEncoding( 'utf8' );

      reset_response.on( 'data', function( response ) {

        res.json( JSON.parse( response ) );


      });


    });

    post_req.on( 'error', function( e ) {

      console.log( e );

    });

    post_req.write( post_data );
    post_req.end();

  });


  /**
  * Setting a new password
  */

  app.post( '/reset-password', function( req, res ) {

    var post_data = querystring.stringify({

      'password'    : req.body.password

    });

    options.path = '/' + globals.VERSION + '/' + globals.CHANGE_PASSWORD;
    options.headers[ 'content-length' ] = post_data.length;
    options.headers[ 'Authorization' ] = req.query.token;

    console.log( options.headers );

    var post_req = http.request( options, function( change_response ) {

      change_response.setEncoding( 'utf8' );
      change_response.on( 'data', function( response ) {

        res.json( JSON.parse( response ) );

      });

    });


    post_req.on( 'error', function( e ) {

      console.log( e );

    });

    post_req.write( post_data );
    post_req.end();

  });


};

module.exports = routes;
