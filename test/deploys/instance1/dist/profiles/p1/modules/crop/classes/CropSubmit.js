define(function( require ) {
  var CropZoom = require('./CropZoom'),
      Modernizr = require('modernizr');

  /**
   * @name CropSubmit
   * @class CropSubmit
   * @constructor
   */
  var CropSubmit = function(image) {
    CropZoom.call(this, image);
    this.hook_imagePreLoad.push($.proxy(this.bindSubmitHandler, this));
    this.submitBtn;
    this.submitHandler = function(image){};
    this.canvasCropping = {
      x      : 0,
      y      : 0,
      width  : 400,
      height : 400
    }

    if (window.File && window.FileReader && window.FileList && window.Blob) {
      this.canvasSupport = true;
    } else {
      this.canvasSupport = false;
    }
  };

  CropSubmit.prototype = CropZoom.prototype;
  CropSubmit.prototype.constructor = CropZoom;

  /**
   * Bind submit
   * @name CropSubmit#bindSubmitHandler
   * @function
   */
  CropSubmit.prototype.bindSubmitHandler = function() {
    this.submitBtn = this.modal.on('click', 'input[type=submit]', $.proxy(this.submit, this))
      .on('mouseover', 'input[type=submit]', $.proxy(this.mouseoverHandler, this))
      .on('mouseleave', 'input[type=submit]', $.proxy(this.mouseleaveHandler, this))
      .on('mousedown', 'input[type=submit]', $.proxy(this.mousedownHandler, this))
      .on('mouseup', 'input[type=submit]', $.proxy(this.mouseleaveHandler, this))
  }

  /**
   * Bind submit
   * @name CropSubmit#bindSubmitHandler
   * @function
   */
  CropSubmit.prototype.mouseoverHandler = function() {
    this.cropMaskEl.addClass('cropping').removeClass('cropped');
  }

  /**
   * Bind submit
   * @name CropSubmit#bindSubmitHandler
   * @function
   */
  CropSubmit.prototype.mousedownHandler = function() {
    this.cropMaskEl.addClass('cropped').removeClass('cropping');
  }

  /**
   * Bind submit
   * @name CropSubmit#bindSubmitHandler
   * @function
   */
  CropSubmit.prototype.mouseleaveHandler = function() {
    this.cropMaskEl.removeClass('cropped').removeClass('cropping');
  }

  /**
   * Submit
   * @name CropSubmit#submit
   * @function
   */
  CropSubmit.prototype.submit = function(e) {
    e.preventDefault();
    this.getImageData();
  }

  /**
   * Gets the image data
   * @name CropSubmit#getImageData
   * @function
   */
  CropSubmit.prototype.getImageData = function() {
    if(this.canvasSupport) {
      var c = $('.js-crop-helper', this.modal)[0];
      var ctx = c.getContext('2d');
      var crop = this.getCropping();
      ctx.drawImage(
        this.imageEl[0],
        crop.x,
        crop.y,
        crop.width - 1,
        crop.height - 1,
        this.canvasCropping.x,
        this.canvasCropping.y,
        this.canvasCropping.width,
        this.canvasCropping.height
      );
      this.submitHandler(c.toDataURL('image/png'), this.canvasCropping);
    } else {
      this.submitHandler();
    }

  }

  return CropSubmit;



});
