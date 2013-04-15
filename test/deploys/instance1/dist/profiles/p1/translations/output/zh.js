if( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}
define(function() {
  var t = {
    "Full name": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Full name";
    },
    "Gender": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Gender";
    },
    "Male": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Male";
    },
    "Female": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Female";
    },
    "Birth date": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Birth date";
    },
    "Email": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Email";
    },
    "Set a password": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Set a password";
    },
    "By clicking Join you agree to P1’s terms of usage and privacy policy.": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: By clicking Join you agree to P1’s terms of usage and privacy policy.";
    },
    "Join now": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Join now";
    },
    "Send": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Send";
    },
    "Zoom or reposition your image.": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Zoom or reposition your image.";
    },
    "jnrrnr()": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: jnrrnr()";
    },
    "Log in": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Log in";
    },
    "Share and recommend your favorite things": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Share and recommend your favorite things";
    },
    "get inspiration from your friends.": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: get inspiration from your friends.";
    },
    "Sign in with weibo": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Sign in with weibo";
    },
    "Or register with your email address.": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Or register with your email address.";
    },
    "About us": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: About us";
    },
    "Jobs": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: Jobs";
    }
  };
  return function(translationKey) {
    if(!(translationKey in t)) {
      console.log("You have used an undefined translation key:" + translationKey);
      return false;
    }
    delete arguments[0];
    if("1" in arguments) {
      arguments[0] = arguments[1];
    }
    delete arguments[1];
    return t[translationKey].apply(undefined, arguments);
  };
});
