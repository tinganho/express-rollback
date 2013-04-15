define(function( require ) {

  var Crop = require('profiles/p1/modules/crop/crop'),
      tmpl = require('public/templates/tmpl');

  describe('Modules', function() {

    describe('Crop', function(){
      before(function(){
        document.body.innerHTML += tmpl['signup-step-1']({
          'full_name'               : gt('Full name'),
          'gender'                  : gt('Gender'),
          'male'                    : gt('Male'),
          'female'                  : gt('Female'),
          'birth_date'              : gt('Birth date'),
          'email'                   : gt('Email'),
          'set_a_password'          : gt('Set a password'),
          'term_and_privacy_desc'   : gt('By clicking Join you agree to P1’s terms of usage and privacy policy.'),
          'join_now'                : gt('Join now')
        });
      });
      it('should be able to crop a canvas', function() {
        expect(Crop.zoomTo());
      });
    });
  });
});
