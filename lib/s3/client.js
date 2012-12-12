/*!
 * s3cli - client
 * Copyright(c) 2012 ogom
 * MIT Licensed
 */
'use strict';

var service = require('./api/service'),
    buckets = require('./api/buckets'),
    objects = require('./api/objects');

/**
 * S3 Client
 * @param {Object} options Client options.
 */
function Client(options) {
  if (options.host_base) {
    options.host_bucket = options.host_bucket || '%(bucket)s.' + options.host_base; 
  } else {
    throw new Error('.s3cli config does not exist');  
  }

  if (options.use_https === 'True') {
    options.use_https = true;
  } else {
    options.use_https = false;
  }

  this.service = new service(options);
  this.buckets = new buckets(options);
  this.objects = new objects(options);
}

/**
 * Create client
 * @param {Object} options Client options.
 * @return {Client}        S3 Client
 */
exports.createClient = function (options) {
  return new Client(options);
};
