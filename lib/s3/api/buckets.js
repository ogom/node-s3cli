/*!
 * s3cli - buckets
 * Copyright(c) 2012-2013 ogom
 * MIT Licensed
 */
'use strict';

var request = require('../request');

/**
 * Buckets API 
 * @param {Object} options API options.
 */
function API(options) {
  this.options = options;
  this.request = new request(this.options);
}

/**
 * Create bucket
 * @param  {String}   name Bucket name.
 * @param  {Function} cb   Callback.
 * @return {Response}      HTTP response.
 */
API.prototype.create = function (name, cb) {
  if (!name) return cb(new Error('bucket name is not defined'));

  this.request.put('/', {}, {}, {bucket: name}, function (err, res) {
    if (err) {
      cb(err);
    } else {
      if (res.status === 200) {
        cb(null, res);
      } else {
        if (res.content) {
          cb(new Error(res.content.message), res);
        } else {
          cb(new Error('unknown'), res);
        }
      }
    }
  });
};

/**
 * Objects list
 * @param  {String}   name  Bucket name.
 * @param  {Object}   query HTTP request query.
 * @param  {Function} cb    Callback.
 * @return {Response}       HTTP response.
 */
API.prototype.objects = function (name, query, cb) {
  if (!name) return cb(new Error('bucket name is not defined'));

  this.request.get('/', query, {bucket: name}, function (err, res) {
    if (err) {
      cb(err);
    } else {
      if (res.status === 200) {
        if (res.content.contents) {
          if (!Array.isArray(res.content.contents)) {
            res.content.contents = [res.content.contents];
          }
        } else {
          res.content.contents = [];
        }
        cb(null, res);
      } else {
        if (res.content) {
          cb(new Error(res.content.message), res);
        } else {
          cb(new Error('unknown'), res);
        }
      }
    }
  });
};

/**
 * Destroy bucket
 * @param  {String}   name Bucket name.
 * @param  {Function} cb   Callback.
 * @return {Response}      HTTP response.
 */
API.prototype.destroy = function (name, cb) {
  if (!name) return cb(new Error('bucket name is not defined'));
  
  this.request.del('/', {}, {bucket: name}, function (err, res) {
    if (err) {
      cb(err);
    } else {
      if (res.status === 204) {
        cb(null, res);
      } else {
        if (res.content) {
          cb(new Error(res.content.message), res);
        } else {
          cb(new Error('unknown'), res);
        }
      }
    }    
  });
};

module.exports = API;
