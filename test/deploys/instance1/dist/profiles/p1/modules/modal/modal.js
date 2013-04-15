define(function( require ) {
  'use strict';
  var $           = require('jquery'),
      BackOverlay = require('profiles/p1/lib/js/backoverlay'),
      tmpl        = require('public/templates/tmpl'),
      gt          = require('profiles/p1/translations/output/en');


  var Modal = function(options) {
    this.body = options.body || '';
    this.desc = options.desc || 'Please enter a description text here';
    this.sendText = options.sendText || gt('Send');
    this.square = options.square || false;
    this.modal = null;
    this.modalSelector = '.modal';
  };

  Modal.prototype.render = function() {
    var _this = this;
    BackOverlay.init();
    BackOverlay.open(tmpl.modal({
      body: this.body,
      desc: this.desc,
      send: this.sendText
    }));
    this.modal = $(this.modalSelector, BackOverlay.backoverlay);
    setTimeout(function(){
      _this.modal.removeClass('initial');
    }, 200);
    this.bodyContainer = $('.body', BackOverlay.backoverlay);
  };

  Modal.prototype.setBody = function(html) {
    this.bodyContainer.innerHTML = html;
  };

  return Modal;
});
