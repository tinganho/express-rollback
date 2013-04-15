if( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}
define(function() {
  var t = {
    "Full name": function anonymous(it) {
      return "Full name";
    },
    "Gender": function anonymous(it) {
      return "Gender";
    },
    "Male": function anonymous(it) {
      return "Male";
    },
    "Female": function anonymous(it) {
      return "Female";
    },
    "Birth date": function anonymous(it) {
      return "Birth date";
    },
    "Email": function anonymous(it) {
      return "Email";
    },
    "Set a password": function anonymous(it) {
      return "Set a password";
    },
    "By clicking Join you agree to P1’s terms of usage and privacy policy.": function anonymous(it) {
      return "By clicking Join you agree to P1’s terms of usage and privacy policy.";
    },
    "Join now": function anonymous(it) {
      return "Join now";
    },
    "Send": function anonymous(it) {
      return "Send";
    },
    "Zoom or reposition your image.": function anonymous(it) {
      return "Zoom or reposition your image.";
    },
    "jnrrnr()": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: jnrrnr()";
    },
    "Log in": function anonymous(it) {
      return "Log in";
    },
    "Share and recommend your favorite things": function anonymous(it) {
      return "Share and recommend your favorite things";
    },
    "get inspiration from your friends.": function anonymous(it) {
      return "get inspiration from your friends.";
    },
    "Sign in with weibo": function anonymous(it) {
      return "Sign in with Wiebo";
    },
    "Or register with your email address.": function anonymous(it) {
      return "Or <a class='email-registration-link f-w-300'>register</a> with your email address.";
    },
    "About us": function anonymous(it) {
      return "About us";
    },
    "Jobs": function anonymous(it) {
      return "Jobs";
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
