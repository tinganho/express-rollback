if( typeof define != 'function' ) {
  var define = require( 'amdefine' )( module );
}

define(function( app ) {

  var globals = {

    // Routes
    P1_ROUTES         : 'profiles/p1/routes',
    // Modules path
    P1_MODULES        : 'profiles/p1/modules',

    // Templates
    TEMPLATES         : 'public/templates/tmpl',

    // Paths
    TEMPLATES         : 'public/templates/tmpl',
    TRANSLATION       : 'profiles/p1/translations/output/en',
    TMP_FILES         : 'public/tmp',

    // Backend mapping

    // Weibo
    WEIBO_CALLBACK_URL : 'https://api.weibo.com/oauth2/authorize?client_id=1355421978&redirect_uri=http://127.0.0.1/weibo-access-token&response_type=code',


    ACCOUNTS          : 'accounts',
    API               : 'api',

    DOMAIN            : 'master.testing.p1staff.com',

    OAUTH             : 'oauth2',
    CORE              : 'core',
    RESET             : 'reset-password',
    CHANGE_PASSWORD   : 'change-password',

    VERSION           : 'v1',
    ACCOUNTS_PORT     : 80,


    HEADERS           : {

      'Content-Type'    : 'application/x-www-form-urlencoded',
      'Connection'      : 'keep-alive',
      'Cache-Control'   : 'no-cache',
      'Accept-Encoding' : 'gzip,deflate,sdch'

    }


  };

  return globals;

});



