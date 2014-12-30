'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var extend = require('extend-shallow');
var parsePath = require('parse-filepath');
var rewrite = require('rewrite-ext');


module.exports = function destPath(dest, options) {
  if (typeof dest !== 'string') {
    options = dest;
    dest = '.';
  }

  return through.obj(function (file, encoding, cb) {
    var opts = extend({}, options);

    try {
      // get the new dest extension based on the engine extension
      var ext = opts.ext || path.extname(file.path);

      // calculate the new destination path
      file.path = rewrite(path.join(file.base, dest, file.relative), ext);

      // parse the path and update `file.data.dest`
      // with the new properties
      if (file.data) {
        var parsed = parsePath(file.path);
        file.data.dest = file.data.dest || {};
        for (var key in parsed) {
          file.data.dest[key] = parsed[key];
        }
        file.data.dest = extend(file.data.dest, {
          path: file.path,
          ext: parsed.extname
        });
        file.data.dest.path = dest;
      }

      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-dest', err));
    }

    return cb();
  });
};
