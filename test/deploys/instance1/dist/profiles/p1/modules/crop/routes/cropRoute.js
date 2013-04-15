

var path  = require('path'),
requirejs = require('requirejs'),
  globals = requirejs('profiles/p1/lib/constants/globals'),
       fs = require('fs'),
   findup = require('findup-sync');

module.exports = function(server) {

  server.post('/upload/profile/image', function(req, res){
    var relPath = globals.TMP_FILES + '/' + process.env.P1_SERVER_NAME + '-' + (new Date()).getTime() + path.extname(req.files.image.name);
    var name = server.get('root') + '/' + relPath;
    fs.readFile(req.files.image.path, function (err, data) {
      fs.writeFile(name, data, function (err) {
        res.send(relPath);
      });
    });
  });
}
