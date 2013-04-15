
/** 

  @todo Documentation
  @description This view handles the signup friends interactions
  The friend list itself will be another subview

*/

define([

  'backbone',
  'public/templates/tmpl'

], function( Backbone, tmpl, SignupHelpCollection ) {

  'use strict';

  var SignupHelp = new Backbone.Collection([
  {
    type    : 'step1',
    title   : 'Let\'s get started!',
    content : 'Fill in this form so we can get all of your data and sell it to third party companies.'

  },
  {
    type    : 'step2',
    title   : 'Bring your homies',
    content : 'It\'s better with friends, and we very much want to leech on your data... Please.'

  },

  {
    type    : 'pictures',
    title   : 'Profile & cover pictures',
    content  : 'Description1'
  },
  {
    type    : 'name',
    title   : 'Fullname:',
    content  : 'Description2'
  },
  {
    type    : 'gender',
    title   : 'ASV:',
    content  : 'Description3'
  },
  {
    type    : 'birthdate',
    title   : 'ASV:',
    content  : 'Description4'
  },
  {
    type    : 'email',
    title   : 'Your email:',
    content  : 'Bah ouais, sinon comment on te spamme?'
  },
  {
    type    : 'password',
    title   : 'Your password:',
    content  : 'Make it strong, keep it secret, keep it safe'
  },
  {
    type    : 'submit',
    title   : 'Before you continue:',
    content  : 'For more informations, take a look at our terms of usage and our privacy policy.'

  }
  ]);

  var SignupHelpView = Backbone.View.extend({

  	template	: tmpl[ 'signup-help' ],
    collection : SignupHelp,

    render		: function( type ) {

      var helpData = this.collection.where({ type : type }) || 'default';

    	this.el = this.template({

        help  : helpData[0].toJSON()

      });

    	return this;

    }

  });

  return SignupHelpView;

});
