define(function( require ) {

  var CropDrag = require('./CropDrag'),
      $ = require('jquery');

  /**
   * @name CropZoom
   * @class CropZoom
   * @constructor
   */
  var CropZoom = function(image) {

    CropDrag.call(this, image);
    this.hook_imagePreLoad.push($.proxy(this._setZoomProperties, this));

    this.zoom = {
      min: null,
      max: null
    }
  };

  CropZoom.prototype = CropDrag.prototype;
  CropZoom.prototype.constructor = CropDrag;

  /**
   * Mouse wheel handler
   * @name CropZoom#mouseWheelHandler
   * @function
   */
  CropZoom.prototype.mouseWheelHandler = function(e) {

    e.preventDefault();

    var delta = 0;
    if (e.originalEvent.wheelDelta) {
      delta = e.originalEvent.wheelDelta / 120;
    }

    if (e.originalEvent.detail) {
      if (e.originalEvent.type === 'MozMousePixelScroll') {
        delta = -e.originalEvent.detail / 42;
      } else {
        delta = -e.originalEvent.detail / 3;
      }
    }

    if(delta > 1) delta = 1;
    if(delta < -1) delta = -1;

    this.zoomTo(this.image.zoom + (delta / 20), this.mousePosition);
  }

  /**
   * Zoom to
   * @name CropZoom#zoomTo
   * @function
   *
   * @param {Number} newZoom
   * @param {Object} origin
   */
  CropZoom.prototype.zoomTo = function(newZoom, origin) {
    // Constrain zoom
    if(newZoom < this.zoom.min) {
      newZoom = this.zoom.min;
    }
    if(newZoom > this.zoom.max) {
      newZoom = this.zoom.max;
    }

    // Calculate the origin to zoom from
    var imgOrigin;
    if(typeof origin !== "undefined") {
      imgOrigin =  this.getOffsetInImage(origin);
    } else {
      imgOrigin = {
        x: this.originalImage.width * this.image.zoom / 2,
        y: this.originalImage.height * this.image.zoom / 2
      };
    }
    var zoomDiff = this.image.zoom - newZoom;
    var xDiff = this.originalImage.width * zoomDiff;
    var yDiff = this.originalImage.height * zoomDiff;
    var originXPercent = imgOrigin.x / this.image.width;
    var originYPercent = imgOrigin.y / this.image.height;

    // Set new properties
    this.image.zoom = newZoom;
    this.image.height = this.originalImage.height * newZoom;
    this.image.width = this.originalImage.width * newZoom;

    // Move image element
    this.imageEl.css({
      height: this.image.height,
      width: this.image.width
    });

    // Move picture
    this.moveBy( xDiff * originXPercent, yDiff * originYPercent );
  }

  /**
   * Set zoom properties
   * @name CropZoom#_setZoomProperties
   * @function
   */
  CropZoom.prototype._setZoomProperties = function() {
    if(this.zoom.min) {
      return;
    }
    if(!this.cropMask.width) {
      this._setCropMaskProperties();
    }


    var borderWidth = 2*this.borderWidth;
    this.zoom.min = Math.max(this.cropMask.width / this.originalImage.width, this.cropMask.height / this.originalImage.height);
    this.zoom.max = Math.max(1, this.zoom.min  + 0.5);
  }

  /**
   * Get the offset in image
   * @name CropZoom#getOffsetInImage
   * @function
   *
   * @param {Object} offset
   */
  CropZoom.prototype.getOffsetInImage = function(offset) {
    var imgOffset = this.imageEl.offset();
    return {
      x : offset.x - imgOffset.left,
      y : offset.y - imgOffset.top
    };
  };

  return CropZoom;

});
