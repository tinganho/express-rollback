define(function( require ) {
  var tmpl = require('public/templates/tmpl'),
      $ = require('jquery'),
      Module = require('../../module');

  /**
   * @name CropBase
   * @class CropBase
   * @constructor
   */
  var CropBase = function(image) {

    this.modal;
    this.originalImage = {
      width  : null,
      height : null
    }
    this.image = {
      x      : null,
      y      : null,
      width  : null,
      height : null,
      stand  : null,
      zoom   : null
    };
    this.cropMaskEl;
    this.cropMask = {
      width  : null,
      height : null,
      margin : null,
    };
    this.cropMaskLength;

    // Hooks
    if(!this.hook_imagePreLoad) {
      this.hook_imagePreLoad = [
        // Add some function hooks here
      ];
    }
    if(!this.hook_imagePostLoad) {
      this.hook_imagePostLoad = [
        // Add some function hooks here
      ];
    }

    this.borderWidth = 3;

    this.imageEl = image;
    Module.call(this);
  };

  CropBase.prototype = new Module;
  CropBase.prototype.constructor = Module;

  /**
   * Imagecanvas?
   * @name CropBase#imageCanvas
   * @function
   *
   * @returns Boolean
   */
  CropBase.prototype.imageCanvas = function(x, y) {
    return window.File && window.FileReader && window.FileList && window.Blob;
  };

  /**
   * Move the image by the given pixels
   * @name CropBase#moveBy
   * @function
   *
   * @param {Number} x
   * @param {Number} y
   */
  CropBase.prototype.moveBy = function(x, y) {
    this.moveTo(
      this.image.x + x,
      this.image.y + y
    );
  };

  /**
   * Move the image to the given co-ordinates
   * @name CropBase#moveTo
   * @function
   *
   * @param {Number} x
   * @param {Number} y
   */
  CropBase.prototype.moveTo = function(x, y) {

    // Constraints
    var minX = this.cropMask.width - this.image.width;
    var minY = this.cropMask.height  - this.image.height;
    var maxX = 0;
    var maxY = 0;



    var newX = x, newY = y;
    if(newX < minX) newX = minX;
    if(newY < minY) newY = minY;
    if(newX > maxX) newX = maxX;
    if(newY > maxY) newY = maxY;

    // Move the image
    this.imageEl.css({
      top  : newY,
      left : newX
    });

    this._updateImageDimensions();
  };

  /**
   * Get the cropping data of the current image
   * @name CropBase#getCropping
   * @function
   *
   * @returns {Object} x, y, width, height
   */
  CropBase.prototype.getCropping = function() {
    return {
      x      : -this.image.x / this.image.zoom,
      y      : -this.image.y / this.image.zoom,
      width  : this.cropMaskLength / this.image.zoom,
      height : this.cropMaskLength / this.image.zoom
    }
  }

  /**
   * Sets the crop mash properties
   * @name CropBase#_setCropMaskProperties
   * @function
   */
  CropBase.prototype._setCropMaskProperties = function() {
    this.cropMask = {
      width  : this.cropMaskEl.width() + 2*this.borderWidth,
      height : this.cropMaskEl.height() + 2*this.borderWidth,
      margin : this.cropMaskEl.position().left
    }
  }

  /**
   * Update image dimensions
   * @name CropBase#_updateImageDimensions
   * @function
   */
  CropBase.prototype._updateImageDimensions = function() {
    this.image = {
      x      : - this.getInt(this.imageEl.css('left')),
      y      : - this.getInt(this.imageEl.css('top')),
      width  : this.imageEl.width(),
      height : this.imageEl.height(),
      stand  : this.getHTMLStand(this.imageEl),
      zoom   : this.imageEl.width() / this.originalImage.width
    }
  }

  /**
   * Set the original image dimensions
   * @name CropBase#_setOriginalImageDimensions
   * @function
   *
   * @param {Object} originalImage A JQuery object of the image
   */
  CropBase.prototype._setOriginalImageDimensions = function(originalImage) {
    if(this.originalImage.width) {
      return;
    }
    this.originalImage = {
      width  : originalImage.width(),
      height : originalImage.height()
    }
    this.image.stand = this.getHTMLStand(this.imageEl);
  }

  /**
   * Set the original image dimensions
   * @name CropBase#render
   * @function
   *
   * @param {Object} container Html object
   */
  CropBase.prototype.render = function(container) {

    // Append html
    var crop = tmpl.crop({image: this.getHTML(this.imageEl)});
    $(container).html(crop);
    this.modal = $(container).parent('.modal');

    // Set image element
    this.imageEl = $('img', container);
    // Set crop mask element
    this.cropMaskEl = $('.image-mask-center', container)
      .on('mousedown.crop', $.proxy(this.mouseDownHandler, this))
      .on('mousemove.crop', $.proxy(this.mouseMoveHandler, this))
      .on('mouseup.crop mouseleave.crop', $.proxy(this.mouseUpHandler, this))
      .on('mousewheel.crop DOMMouseScroll.crop MozMousePixelScroll.crop', $.proxy(this.mouseWheelHandler, this));

    // Set crop mask side length
    console.log(this.getInt(this.borderWidth + ''));
    this.cropMaskLength = this.cropMaskEl.width() + 2*this.borderWidth; // Use left because of mozilla
    

    // Set crop mask properties
    this._setCropMaskProperties();




    var _this = this;
    this.imageEl[0].onload = function() {
      // Set original dimensions
      _this._setOriginalImageDimensions(_this.imageEl);


      for(var fn in _this.hook_imagePreLoad) {
        if(typeof _this.hook_imagePreLoad[fn] !== 'function' ){
          _this.throwError('NotAFunctionError');
        }
        _this.hook_imagePreLoad[fn]();


      }

      var ratio;
      if(_this.image.stand === 'portrait') {
        _this.imageEl.width(_this.cropMaskLength);
        _this.image.zoom = _this.cropMaskLength / _this.originalImage.width;
        _this.image.height = _this.originalImage.height * _this.image.zoom;
        _this.imageEl.height(_this.image.height);
        _this.image.width = _this.cropMaskLength;
        _this.image.y = -(_this.image.height - _this.cropMaskLength) / 2;
        _this.image.x = 0;
        _this.imageEl.css({
          position: 'absolute'
        });
      } else {
        _this.imageEl.height(_this.cropMaskLength);
        _this.image.zoom = _this.cropMaskLength / _this.originalImage.height;
        _this.image.width = _this.originalImage.width * _this.image.zoom;
        _this.imageEl.width(_this.image.width);
        _this.image.height = _this.cropMaskLength;
        _this.image.y = 0;
        _this.image.x = -(_this.image.width - _this.cropMaskLength) / 2;
        _this.imageEl.css({
          position: 'absolute'
        });
      }
      _this.moveTo(_this.image.x, _this.image.y);

      for(var fn in _this.hook_imagePostload) {
        if(typeof _this.hook_imagePreload[fn] !== 'function' ){
          _this.throwError('NotAFunctionError');
        }
        _this.hook_imagePostload[fn]();
      }

      // Update image propertis
      _this._updateImageDimensions();

    }
  }

  /**
   * Close the image crop
   * @name CropBase#close
   * @function
   */
  CropBase.prototype.close = function(cb) {
    cb();
  }


  return CropBase;


});
