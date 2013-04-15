define(function( require ) {

  var CropBase = require('./CropBase'),
      $ = require('jquery');

  /**
   * @name CropDrag
   * @class CropDrag
   * @constructor
   */
  var CropDrag = function(image) {
    this.mousePosition = {
      x: null,
      y: null
    };
    this.isDragging;
    this.dragStartOffset = {
      x: null,
      y: null
    }
    this.dragStartPosition = {
      x: null,
      y: null
    }
    CropBase.call(this, image);

  };

  CropDrag.prototype = CropBase.prototype;
  CropDrag.prototype.constructor = CropBase;

  /**
   * Mousedown handler
   * @name CropDrag#mouseDownHandler
   * @function
   *
   * @param {Object} e An HTML event
   */
  CropDrag.prototype.mouseDownHandler = function(e) {

    if(e.target !== this.cropMaskEl[0]) {
      return;
    }

    // IE/Old firefox support for dragging outside the window.
    if(this.cropMaskEl[0].setCapture) {
      this.cropMaskEl[0].setCapture();
    }

    // Record the starting values of the drag operation.
    this.dragStartPosition = {
      x: e.pageX,
      y: e.pageY
    };

    // Record the offset of the mouse within the image.
    var imageElPos = this.imageEl.position();
    this.dragStartOffset = {
      x: imageElPos.left,
      y: imageElPos.top
    };

    // Set dragging flag so the move event repositions the image.
    this.isDragging = true;
    e.preventDefault();

  };

  /**
   * Mouseup handler
   * @name CropDrag#mouseUpHandler
   * @function
   *
   * @param {Object} e An HTML event
   */
  CropDrag.prototype.mouseUpHandler = function(e) {
    if(this.cropMaskEl[0].releaseCapture) {
      this.cropMaskEl[0].releaseCapture();
    }
    this.isDragging = false;
  };

  /**
   * MouseMoveHandler handler
   * @name CropDrag#mouseMoveHandler
   * @function
   *
   * @param {Object} e An HTML event
   */
  CropDrag.prototype.mouseMoveHandler = function(e) {

    this.mousePosition = {
      x: e.pageX,
      y: e.pageY
    }

    if(this.isDragging) {
      // Use the shift key to resize
      if(e.shiftKey) {
        var dimensions = this.getImageSize();
        var z = this.dragStartZoom + ((e.pageY - this.dragStartPosition.y) / dimensions.y);
        this.zoomTo(z, this.dragStartPosition);
      }
      else {
        var x = this.dragStartOffset.x + (e.pageX - this.dragStartPosition.x);
        var y = this.dragStartOffset.y + (e.pageY - this.dragStartPosition.y);
        this.moveTo(x, y);
      }
      this._updateImageDimensions();
    }
  };

  return CropDrag;
});
