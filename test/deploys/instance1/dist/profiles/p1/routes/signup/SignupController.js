define(function( require ) {

  'use strict';

  var $           = require('jquery'),
      Backbone    = require('backbone'),
      Backoverlay = require('profiles/p1/lib/js/backoverlay'),
      gt          = require('profiles/p1/translations/output/en'),
      File        = require('profiles/p1/lib/js/file'),
      Modal       = require('profiles/p1/modules/modal/modal'),
      Crop        = require('profiles/p1/modules/crop/Crop'),
      E           = require('profiles/p1/lib/js/errors');

  return function() {

    var form                  = $('.js-image-upload'),
        input                 = form.find('input[type=file]'),
        imageInput            = $('.js-signup-thumbnail'),
        imageUploadHelper     = $('#image-upload-helper'),
        imageThumbnailPreview = form.find('.image-thumbnail-preview');

    var crop;

    // Initialize backoverlay
    Backoverlay.init();
    Backoverlay.closeCallback = function() {
      input.val('');
    };

    var file = new File();
    // Attach handler for fileBtn
    file.fileBtn(input, form, function() {

      crop = new Crop(this.image);

      var modal = new Modal({
        body: '',
        desc: gt('Zoom or reposition your image.'),
      });
      modal.render();
      crop.render(modal.bodyContainer);
      crop.submitHandler = function(image, crop) {
        var _this = this;
        var data;
        if(file.canvasSupport) {
          data = {
            type : 'canvas',
            data : {
              src  : image,
              crop : crop
            }
          }
        } else {
          data = {
            type: 'regular',
            data: {
              src  : file.image.src,
              crop : this.getCropping()
            }
          }
        }
        try {
          imageInput.val(JSON.stringify(data));
        } catch (e) {
          throw new E.WrongJSONFormatError()
        }
        this.close(function() {
          setTimeout(function(){
            Backoverlay.close();
            var copy, haveImage = imageThumbnailPreview.children().length > 0;
            if(haveImage) {
              copy = imageThumbnailPreview.clone(true);
              copy.removeClass('final').addClass('initial');
              imageThumbnailPreview.after(copy);
              copy.html('').append(_this.imageEl);
            } else {
              imageThumbnailPreview.append(_this.imageEl);
            }
            var image = _this.getCropping();
            var ratio = 100 / _this.cropMask.width * _this.image.zoom;
            _this.imageEl.width(ratio * _this.originalImage.width)
              .height(ratio * _this.originalImage.height)
              .css({
                left : ratio * _this.image.x / _this.image.zoom,
                top  : ratio * _this.image.y / _this.image.zoom
              });
            setTimeout(function(){
              if(haveImage) {
                copy.removeClass('intial').addClass('final');
                imageThumbnailPreview.removeClass('final').removeClass('initial');
                setTimeout(function() {
                  imageThumbnailPreview.remove();
                  imageThumbnailPreview = copy;
                }, 500); // I won't use transition end yet until I find suitable lib
              } else {
                imageThumbnailPreview.removeClass('initial').addClass('final');
              }
            }, 0);


          }, 100);
        });
      }
    });

    imageUploadHelper.load(function() {
      var src = $(this).contents().find('body').html();
      file.createImage(src);
      file.image.onload = function() {
        file.fileChangeCallback();
      }
    });
  }
});
