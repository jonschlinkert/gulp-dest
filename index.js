'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var extend = require('extend-shallow');
var rewrite = require('rewrite-ext');
var parse = require('parse-filepath');
var rte = require('rte');

module.exports = function destPath(dest, fn, options) {
  if (typeof fn !== 'function') {
    options = fn;
    fn = null;
  }

  if (typeof dest !== 'string') {
    options = dest;
    dest = '.';
  }

  return through.obj(function (file, enc, cb) {
    var opts = extend({}, options);
    var parsed = extend(parse(file.path), opts);
    if (typeof fn === 'function') {
      parsed = fn(parsed, file);
    }

    try {
      if (dest.indexOf(':') !== -1) {
        file.path = rte(dest, parsed);
      } else {
        // get the new dest extension based on the engine extension
        var ext = opts.ext || opts.extname || path.extname(file.path);
        var name = opts.basename || file.relative;
        var base = opts.base || opts.dirname || file.base;

        // calculate the new destination path
        file.path = rewrite(path.join(base, dest, name), ext);
      }

      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-dest', err));
    }

    return cb();
  });
};
