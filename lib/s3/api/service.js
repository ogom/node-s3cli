/*!
 * s3cli - service
 * Copyright(c) 2012 ogom
 * MIT Licensed
 */
'use strict';

var request = require('../request');
   
/**
 * Servder API 
 * @param {Object} options API options.
 */
function API(options) {
  this.options = options;
  this.request = new request(this.options);
}

/**
 * Buckets lits
 * @param  {Function} cb Callback.
 * @return {Response}    HTTP response.
 */
API.prototype.buckets = function (cb) {
  this.request.get('/', {}, {}, function (err, res) {
    if (err) {
      cb(err);
    } else {
      if (res.status === 200) {
        if (res.content.buckets.bucket) {
          if (!Array.isArray(res.content.buckets.bucket)) {
            res.content.buckets.bucket = [res.content.buckets.bucket];
          }
        } else {
          res.content.buckets.bucket = [];
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

module.exports = API;
