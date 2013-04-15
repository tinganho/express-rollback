define(function( require ) {

  $ = require('jquery');
  Modernizr = require('modernizr');

  /**
   * @name File
   * @class File
   * @constructor
   */
  var File = function() {

    this.draggingover = false;
    this.fileChangeCallback = null;
    this.image = null;
    this.canvasSupport = false;
  }

  /**
   * Sets dropeffect and draggingover
   * @name File#_handleDragOver
   * @function
   *
   * @param {Object} e
   */
  File.prototype._handleDragOver = function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    this.draggingover = true;
  };

  /**
   * Sets draggingover to false
   * @name File#_handleDragLeave
   * @function
   *
   * @param {Object} e
   */
  File.prototype._handleDragLeave = function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.draggingover = false;
  };

  /**
   * Instantiates a filebtn
   * @name File#fileBtn
   * @function
   *
   * @param {Object} fileInput
   * @param {Object} areaElement
   * @param {Object} cb
   */
  File.prototype.fileBtn = function(fileInput, areaElement, cb) {

    var this_ = this;
    // We set x when we first scroll the area as areaElement is hidden, x is going to be set to 0.
    var y = null;

    areaElement.on('mouseenter mousemove',function(e) {
      if(this_.draggingover) {
        areaElement.css('top', 1000000);
      }
      if(!y) {
        y = areaElement.offset().top;
      }
      fileInput.css('top', parseInt(e.clientY - y - 5, 10)+'px');
    });
    this.fileInput = fileInput;
    this.fileInput.change(function(e) {
      this_.imageFileSelect(e);
    });

    if(Modernizr.draganddrop) {
      $(areaElement).bind('drop', this.imageCanvasFileSelect)
        .bind('dragover', this._handleDragOver)
        .bind('dragleave', this._handleDragLeave);
    }

    // Set the fileChangeCallback
    this_.fileChangeCallback = typeof cb !== 'undefined' ? cb : function(){};
  };

  /**
   * A router for slecting either fallback image canvas solution or not
   * @name File#imageFileSelect
   * @function
   *
   * @param {Object} e
   */
  File.prototype.imageFileSelect = function(e) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      this.canvasSupport = true;
      this.imageCanvasFileSelect(e);
    } else {
      this.canvasSupport = false;
      this.imageFallbackFileSelect();
    }
  };

  /**
   * Create image
   * @name File#createImage
   * @function
   *
   * @param {Object} e
   */
  File.prototype.createImage = function(src) {

    var image = document.createElement('img')
    image.src = src;
    this.image = image;
  };


  /**
   * Image select fallback handler
   * @name File#imageFallbackFileSelect
   * @function
   *
   * @param {Object} e
   */
  File.prototype.imageFallbackFileSelect = function(e) {

    var this_ = this;
    this.fileInput.parent().submit();
  };

  /**
   * Instantiates a filebtn
   * @name File#imageCanvasFileSelect
   * @function
   *
   * @param {Object} e
   */
  File.prototype.imageCanvasFileSelect = function(e) {

    var this_ = this;

    e.stopPropagation();
    e.preventDefault();

    var files = typeof e.dataTransfer !== 'undefined' ? e.dataTransfer.files : e.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(f) {
        return function(e) {

          //define canvas image
          var image = document.createElement('img')
          image.src = e.target.result;
          this_.image = image;

          this_.fileChangeCallback();
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }

  return File;

});
