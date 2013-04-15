define(function( require ) {

  var CropSubmit = require('./classes/CropSubmit'),
      $ = require('jquery');
  /**
   * @name Crop
   * @constructor
   */
  var Crop = function(image) {
    CropSubmit.call(this, image);
  };
  Crop.prototype = CropSubmit.prototype
  Crop.prototype.constructor = CropSubmit;


  return Crop;
});
