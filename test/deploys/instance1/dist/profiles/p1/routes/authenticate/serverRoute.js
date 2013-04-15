var requirejs     = require( 'requirejs' ),
	querystring	  = require( 'querystring' ),
	http		  = require( 'http' ),
    globals       = requirejs( 'profiles/p1/lib/constants/globals' );

var routes = function( app ) {

	var options = {

		hostname	: globals.ACCOUNTS + '.' + app.get( 'domain' ),
		port		: globals.ACCOUNTS_PORT,
		path		: '/' + globals.VERSION + '/' + globals.OAUTH + '/',
		method		: 'POST',
		headers		: globals.HEADERS

	};

	app.get( '/authenticate', function( req, res ) {

    	return res.redirect( '/login' );

	});

	app.post( '/authenticate', function( req, res ) {

		var post_data = querystring.stringify({

			'grant_type'	: 'password',
			'username'		: req.body.username,
			'password'		: req.body.password

		});

		options.headers[ 'content-length' ] = post_data.length;
		options.headers[ 'Authorization' ] = app.get( 'authorization' );

		var post_req = http.request( options, function( auth_res ) {

			// Setting encoding to get the response as a string
			auth_res.setEncoding( 'utf8' );


			auth_res.on( 'data', function( response ) {

				response = JSON.parse( response );

				if( response.error || (! response.access_token || ! response.session_key) ) {

					res.json({

						error	: response.error_description || 'default error'

					});

					return;

				}

				res.cookie( 'access_token', response.access_token, {

					maxAge	: response.expires_in,
					httpOnly: true

				});

				res.cookie( 'session_key', response.session_key, {

					maxAge	: response.expires_in,
					httpOnly: true

				});

				res.json({

					redirect	: 'http://' + app.get( 'domain' ) + '/home/'

				});

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