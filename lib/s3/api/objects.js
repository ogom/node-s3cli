/*!
 * s3cli - objects
 * Copyright(c) 2012 ogom
 * MIT Licensed
 */
'use strict';

var request = require('../request'),
    acl = require('./object/acl');

/**
 * Objects API 
 * @param {Object} options API options.
 */
function API(options) {
  this.options = options;
  this.request = new request(this.options);
}

/**
 * Create object
 * @param  {String}   bucket  Bucket name.
 * @param  {String}   name    Object name.
 * @param  {String}   value   Object value
 * @param  {Object}   options HTTP request query.
 * @param  {Function} cb      Callback.
 * @return {Response}         HTTP response.
 */
API.prototype.create = function (bucket, name, value, options, cb) {
  if (!bucket) return cb(new Error('bucket name is not defined'));
  if (!name) return cb(new Error('object name is not defined'));
  if (!value) return cb(new Error('object value is not defined'));

  this.request.put('/' + name, options, value, {bucket: bucket}, function (err, res) {
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
 * Read Object
 * @param  {String}   bucket  Bucket name.
 * @param  {String}   name    Object name.
 * @param  {Function} cb      Callback.
 * @return {Response}         HTTP response.
 */
API.prototype.read = function (bucket, name, cb) {
  if (!bucket) return cb(new Error('bucket name is not defined'));
  if (!name) return cb(new Error('object name is not defined'));

  this.request.get('/' + name, {}, {bucket: bucket}, function (err, res) {
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
 * Destroy Object
 * @param  {String}   bucket  Bucket name.
 * @param  {String}   name    Object name.
 * @param  {Function} cb      Callback.
 * @return {Response}         HTTP response.
 */
API.prototype.destroy = function (bucket, name, cb) {
  if (!bucket) return cb(new Error('bucket name is not defined'));
  if (!name) return cb(new Error('object name is not defined'));

  this.request.del('/' + name, {}, {bucket: bucket}, function (err, res) {
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

/**
 * Object info
 * @param  {String}   bucket  Bucket name.
 * @param  {String}   name    Object name.
 * @param  {Function} cb      Callback.
 * @return {Response}         HTTP response.
 */
API.prototype.info = function (bucket, name, cb) {
  if (!bucket) return cb(new Error('bucket name is not defined'));
  if (!name) return cb(new Error('object name is not defined'));

  this.request.head('/' + name, {}, {bucket: bucket}, function (err, res) {
    if (err) {
      cb(err);
    } else {
      if (res.status === 200) {
        res.content = {};
        res.content.info = { 
          mime: res.headers['content-type'],
          size: res.headers['content-length'],
          date: res.headers['date'],
          md5: res.headers['etag'].replace(/"/g,'')
        };
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
 * Access control list.
 * @param  {String} bucket Bucket name.
 * @param  {String} name   Object key.
 * @return {acl}           Access control list.
 */
API.prototype.acl = function (bucket, name) {
  return new acl(bucket, name, this.options);
};

module.exports = API;
