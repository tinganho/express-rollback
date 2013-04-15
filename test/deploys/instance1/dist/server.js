
/**
 * Module dependencies.
 */

var express   = require( 'express' ),
    fs        = require( 'fs' ),
    http      = require( 'http' ),
    path      = require( 'path' ),
    requirejs = require( 'requirejs' ),
    colors    = require( 'colors' );

requirejs.config({

  paths: {
    'P1'       : './P1'
  },
  baseUrl: __dirname,
  nodeRequire: require

});

if(!process.env.P1_SERVER_NAME) {
  console.log('[' + ':('.red + ']' + ' You forgot to set your environmental variable P1_SERVER_NAME?'.yellow);
  process.kill();
}

var server = express();
server.configure( function() {

  var config = JSON.parse ( fs.readFileSync( __dirname + '/server.config.json', 'utf8' ) );

  server.set( 'authorization', config.authorization );
  server.set( 'domain', config.domain );
  server.set( 'clientId', config.clientId );
  server.set( 'clientSecret', config.clientSecret );
  server.set( 'root', __dirname );

  server.set( 'port', process.env.PORT || 3000 );
  server.set( 'views', __dirname );

  server.use( express.favicon() );

  server.use( express.bodyParser({ uploadDir: __dirname + '/public/uploads' }));
  server.use( express.cookieParser() );

  server.use( express.methodOverride() );
  server.use( server.router );
  server.use( '/public', express['static'](  __dirname + '/public' ) );
  server.use( '/vendor', express['static'](  __dirname + '/vendor' ) );
  server.use( '/', express['static'](  __dirname ) );
  server.use( '/dist', express['static'](  path.join( __dirname , '../dist/' ) ) );
  server.use( '/app', express['static'](  __dirname + '/app' ) );

});


var P1 = {};

server.configure( 'development', function() {
  server.use( express.logger( 'dev' ) );
  server.use( express.errorHandler() );
});

requirejs( __dirname + '/profiles/p1/routes/login/serverRoute' )( server );
requirejs( __dirname + '/profiles/p1/routes/signup/serverRoute' )( server );
requirejs( __dirname + '/profiles/p1/routes/authenticate/serverRoute' )( server );
requirejs( __dirname + '/profiles/p1/routes/password/serverRoute' )( server );
requirejs( __dirname + '/profiles/p1/routes/weibo/weiboRoute' )( server );
requirejs( __dirname + '/profiles/p1/modules/crop/routes/cropRoute' )( server );

var _server = http.createServer(server).listen( server.get( 'port' ), function() {
  console.log(process.pid + ' Express server listening on port ' + server.get('port') );
});

process.on('SIGTERM', function () {
  console.log('Closing');
  _server.close();
});

module.exports = server;



