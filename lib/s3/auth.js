/*!
 * s3cli - auth
 * Copyright(c) 2012 ogom
 * MIT Licensed
 */
'use strict';

var util = require('util'),
    url = require('url'),
    querystring = require('querystring'),
    crypto = require('crypto');

// Resource include list
var list = [
  'acl', 'delete', 'lifecycle', 'location', 'logging', 'notification', 'partNumber', 'policy', 'requestPayment', 
  'torrent', 'uploadId', 'uploads', 'versionId', 'versioning', 'versions', 'website',
];

/**
 * AWS Authorization sign
 * @param  {Object} request HTTP request.
 * @param  {Object} options Access key and Secret key.
 * @return {String}         AWS Authorization.
 */
exports.sign = function (request, options) {
  var signature = undefined;
  var raw = [
    request.method,
    request.headers['content-md5'] ? request.headers['content-md5'] : '',
    request.headers['content-type'] ? request.headers['content-type'] : '',
    request.headers.date,
    this.headers(request.headers) + this.resource(request.path, options.bucket)
  ].join('\n');

  if (options.debug) {
    util.print('DEBUG: SignHeaders: ');
    console.dir(raw);
  }

  if (options.secret_key) {
    signature = crypto.createHmac('sha1', options.secret_key).update(raw).digest('base64');
  }

  return 'AWS ' + [options.access_key, signature].join(':');
};

/**
 * Canonicalized Amz Headers
 * @param  {Object} raw Raw headers.
 * @return {String}     Headers.
 */
exports.headers = function (raw) {
  var headers = [];
  
  Object.keys(raw).forEach(function (key) {
    if (key.slice(0, 6) === 'x-amz-' && key !=='x-amz-date') {
      headers.push([key, raw[key]].join(':')+ '\n');
    }
  });
  
  return headers.sort().join('');
}

/**
 * Canonicalized Resource
 * @param  {String} path   HTTP path and query.
 * @param  {String} bucket Bucket name.
 * @return {String}        Resource
 */
exports.resource = function (path, bucket) {
  var resource = '';
  var uri = url.parse(path);
  var query = this.query(querystring.parse(uri.query));
  
  if (bucket) resource = '/' + bucket;
  resource += uri.pathname;
  if (query) resource += '?' + query;

  return resource;
}

/**
 * Canonicalized  Query
 * @param  {Object} raw Raw query.
 * @return {String}     query.
 */
exports.query = function (raw) {
  var query = [];
  
  Object.keys(raw).forEach(function (key) {
    if (list.indexOf(key) !== -1) {
      query.push(key + (raw[key] ? '=' + raw[key] : ''));
    }
  });
  
  return query.sort().join('&');
}
