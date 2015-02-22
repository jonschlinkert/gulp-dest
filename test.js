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

  it('should use options.base:', function (cb) {
    var stream = dest({base: 'foo/'});
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
      assert.equal(buffer[0].relative, 'foo/post.md');
      cb();
    });
    stream.end();
  });

  it('should set the destination extension with `ext`:', function (cb) {
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

  it('should set the destination extension with `extname`:', function (cb) {
    var stream = dest({extname: '.html'});
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

  it('should use the properties defined in the options:', function (cb) {
    var stream = dest('dist', {basename: 'foo', ext: '.html'});
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
      assert.equal(buffer[0].relative, 'dist/foo.html');
      cb();
    });
    stream.end();
  });

  it('should work with double extensions:', function (cb) {
    var stream = dest('dist/');
    var buffer = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/post.min.js'
    }));

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].relative, 'dist/post.min.js');
      cb();
    });
    stream.end();
  });

  it('should work with double extensions:', function (cb) {
    var stream = dest('dist', {basename: 'foo', ext: '.min.js'});
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
      assert.equal(buffer[0].relative, 'dist/foo.min.js');
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

  it('should substitute `:props` with file path parts:', function (cb) {
    var stream = dest('dist/:name.foo');
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
      assert.equal(buffer[0].relative, 'dist/post.foo');
      cb();
    });
    stream.end();
  });

  it('should substitute `:props` with options props:', function (cb) {
    var stream = dest(':dir/:name.:a:b:c', {dir: 'dist', a: 'A', b: 'B', c: 'C'});
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
      assert.equal(buffer[0].relative, 'dist/post.ABC');
      cb();
    });
    stream.end();
  });

  it('should allow a function to be used:', function (cb) {
    var stream = dest('dist/:name', function (file, parsed) {
      file.name = 'foo.bar';
      return file;
    });

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
      assert.equal(buffer[0].relative, 'dist/foo.bar');
      cb();
    });
    stream.end();
  });
});
