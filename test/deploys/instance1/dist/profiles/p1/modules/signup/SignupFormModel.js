define([

  'backbone',
  'public/templates/tmpl'

], function( Backbone, tmpl ) {


  var SignupForm = Backbone.Model.extend({

    defaults : {

      // errors
      feedback: {
        'fullNameError' : 'Please fill in your full name. At least 2 charracters long.',
        'genderError'   : 'Please fill in your gender',
        'birthdayError' : 'Please fill in your birthday correctly',
        'emailError'    : 'Please fill in your email correctly',
        'passwordError' : 'Please fill in at least a 6 charracters long password',

        'dayError'      : 'Please correct the month of your birth day',
        'monthError'    : 'Please specify a number between 1-12',
        'yearError'     : 'Please specify a number in nnnn format',
        'dateError'     : 'Please fill in you birth date'
      }
    }

  });

  return SignupForm;

});
