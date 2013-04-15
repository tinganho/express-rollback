define(function( require ) {

  var $ = require('jquery');


  var BackOverlay = {

    backoverlay: null,

    init: function() {
      $(this.backoverlay).unbind('click');
      $(this.backoverlay).bind('click', function(e) {
        if($(e.target).hasClass('backoverlay')) {
          BackOverlay.close();
        }
      });
      this.backoverlay = $('.backoverlay');
    },

    open: function(html) {
      this.backoverlay.html(html);
      BackOverlay.toggleActive();
    },

    close: function() {
      this.backoverlay.html('');
      BackOverlay.toggleActive();
      this.closeCallback();
    },

    closeCallback: function() {},

    toggleActive: function() {
      $(this.backoverlay).toggleClass('active');
    }

  };

  return BackOverlay;

});
