/*!
 * s3cli - acl
 * Copyright(c) 2012 ogom
 * MIT Licensed
 */
'use strict';

var request = require('../../request');

/**
 * Objects API 
 * @param  {String}   bucket  Bucket name.
 * @param  {String}   name    Object name.
 * @param {Object} options API options.
 */
function API(bucket, name, options) {
  this.bucket = bucket;
  this.name = name;
  this.options = options;
  this.request = new request(this.options);
}

/**
 * Read Object ACL
 * @param  {Function} cb     Callback.
 * @return {Response}        HTTP response.
 */
API.prototype.read = function (cb) {
  if (!this.bucket) return cb(new Error('bucket name is not defined'));
  if (!this.name) return cb(new Error('object name is not defined'));
  
  this.request.get('/' + this.name + '?acl', {}, {bucket: this.bucket}, function (err, res) {
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

module.exports = API;
