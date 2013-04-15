define([
  'profiles/p1/modules/login/LoginView',
  'profiles/p1/modules/signup/SignupView'

], function(LoginView, SignupView){

    var init = function() {
      console.log(new LoginView);
      new SignupView;
    }
    return { init: init};

});