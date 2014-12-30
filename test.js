'use strict';

var File = require('vinyl');
var assert = require('assert');
var dest = require('./');

describe('dest()', function () {
  it('should not modify the destination path when nothing is defined:', function (cb) {
    var stream = dest();
    var buffer = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/post.md'
    }));

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].relative, 'post.md');
      cb();
    });
    stream.end();
  });

  it('should set the destination base to the given filepath:', function (cb) {
    var stream = dest('dist');
    var buffer = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/post.md'
    }));

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].relative, 'dist/post.md');
      cb();
    });
    stream.end();
  });

  it('should set the destination extension:', function (cb) {
    var stream = dest({ext: '.html'});
    var buffer = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/post.md'
    }));

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].relative, 'post.html');
      cb();
    });
    stream.end();
  });

  it('should set the destination path and extension:', function (cb) {
    var stream = dest('dist', {ext: '.html'});
    var buffer = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/post.md'
    }));

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].relative, 'dist/post.html');
      cb();
    });
    stream.end();
  });
});
