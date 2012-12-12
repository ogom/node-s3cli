'use strict';

var fs = require('fs'),
    path = require('path'),
    request = require('../../lib/s3/request');

var fn = {};
fn.fixture = function(name) {
  var file = path.join('../fixtures', name + '.json')
  return JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf-8'));
};

request.prototype.request = function(method, path, query, raw, options, cb) {
  if (path === '/') {
    if (options.bucket) {
      switch (method) {
        case 'GET':     // buckets.objects
          cb(null, {content: fn.fixture('objects')});
          break;
        case 'PUT':     // buckets.create
          cb(null, {headers: {location: '/bucket01'}});
          break;
        case 'DELETE':  // buckets.destroy
          cb(null, {status: 204});
          break;
        default:
          break;
      }
    } else {
      switch (method) {
        case 'GET':     // buckets
        cb(null, {content: fn.fixture('buckets')});
        break;
      default:
        break;
      }
    }
  } else {
    if (options.bucket) {
      switch (method) {
        case 'GET':     // objects.read
          cb(null, {body: '123'});
          break;
        case 'PUT':     // objects.create
          cb(null, {status: 200});
          break;
        case 'DELETE':  // objects.destroy
          cb(null, {status: 204});
          break;
        default:
          break;
      }
    }
  }
};
