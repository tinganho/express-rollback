

define([

  'backbone',
  'backoverlay'

], function(

  Backbone,
  backoverlay

) {

  var AlertModel = Backbone.View.extend({

    events : {
      'js-alert-modal-ok' : 'dismiss'
    },

    dismiss : function() {

    }
  });

  return AlertModel;

});
