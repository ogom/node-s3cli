/*!
 * s3cli - request
 * Copyright(c) 2012 ogom
 * MIT Licensed
 */
'use strict';

var util = require('util'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    querystring = require('querystring'),
    mime = require('mime'),
    xml2js = require('xml2js'),
    auth = require('./auth');

var xmlParser = new xml2js.Parser({
  normalizeTags: true,
  explicitRoot: false,
  explicitArray: false
});

/**
 * HTTP Request
 * @param {Object} options HTTP options.
 */
function Request(options) {
  this.options = options;
}

/**
 * Get Request
 * @param  {String}   path    HTTP request path.
 * @param  {Object}   query   HTTP request query.
 * @param  {Object}   options Bucket name.
 * @param  {Function} cb      Callback.
 * @return {Response}         HTTP response.
 */
Request.prototype.get = function (path, query, options, cb) {
  this.request('GET', path, query, {}, options, cb);
};

/**
 * Put Request
 * @param  {String}   path    HTTP request path.
 * @param  {Object}   query   HTTP request header.
 * @param  {Object}   raw     HTTP request body.
 * @param  {Object}   options Bucket name.
 * @param  {Function} cb      Callback
 * @return {Response}         HTTP response.
 */
Request.prototype.put = function (path, query, raw, options, cb) {
  this.request('PUT', path, query, raw, options, cb);
};

/**
 * Delete Request
 * @param  {String}   path    HTTP request path.
 * @param  {Object}   query   HTTP request query.
 * @param  {Object}   options Bucket name.
 * @param  {Function} cb      Callback
 * @return {Response}         HTTP response.
 */
Request.prototype.del = function (path, query, options, cb) {
  this.request('DELETE', path, query, {}, options, cb);
};

/**
 * HEAD Request
 * @param  {String}   path    HTTP request path.
 * @param  {Object}   query   HTTP request query.
 * @param  {Object}   options Bucket name.
 * @param  {Function} cb      Callback.
 * @return {Response}         HTTP response.
 */
Request.prototype.head = function (path, query, options, cb) {
  this.request('HEAD', path, query, {}, options, cb);
};

/**
 * HTTP request
 * @param  {String}   method  HTTP request method.
 * @param  {String}   path    HTTP request path.
 * @param  {Object}   query   HTTP request query.
 * @param  {Object}   raw     HTTP request body.
 * @param  {Object}   options Bucket name.
 * @param  {Function} cb      Callback
 * @return {Response}         HTTP response.
 */
Request.prototype.request = function (method, path, query, raw, options, cb) {
  var self = this;
  self.options.bucket = options.bucket;

  var fn = {};
  fn.isReadStream = function (stream) {
    if (stream.readable && stream.path && stream.mode) return true
  };

  if (method === 'GET' || method === 'HEAD') {
    if (query.prefix !== undefined && query.delimiter === undefined) {
      query.delimiter = '/'; 
    }

    for (var key in query) {
      if (query[key] === undefined) delete query[key];
    }

    query = querystring.stringify(query);
    if (query) path += '?' + query;
  }

  var opts = {
    path: path,
    method: method,
    headers: {date: new Date().toUTCString()}
  };

  if (self.options.bucket) {
    opts.host = self.options.host_bucket.replace('%(bucket)s', self.options.bucket);
  } else {
    opts.host = self.options.host_base;
  }
  
  if (fn.isReadStream(raw)) {
    opts.headers['content-length'] = fs.statSync(raw.path).size;
    opts.headers['content-type'] = mime.lookup(raw.path)
  } else {
    if (raw.length > 0) {
      opts.headers['content-length'] = raw.length;
    }
  }
  
  if (method === 'PUT') {
    for (var key in query) {
      opts.headers[key] = query[key];
    }
  }

  opts.headers['Authorization'] = auth.sign(opts, self.options);
 
  if (self.options.debug) {
    util.print('DEBUG: Request: ');
    console.dir(opts);
  }

  var protocol = self.options.use_https ? https : http;
  var req = protocol.request(opts, function (res) {
    var buffer = [];
    
    res.on('data', function (chunk) {
      buffer.push(chunk);
    });  

    res.on('end', function () {
      res = {
        status: res.statusCode,
        headers: res.headers,
        body: buffer.join('')
      };

      if (self.options.debug) {
        util.print('DEBUG: Response: ');
        console.dir(res);
      }

      if (res.headers['content-type'] === 'application/xml') {
        xmlParser.parseString(res.body, function (err, content) {
          if (err) {
            cb(err);
          } else {
            res.content = content;
            cb(null, res);
          }
        });
      } else {
        cb(null, res);
      }
    });
  });

  req.on('error', function (err) {
    if (self.options.debug) {
      util.print('DEBUG: HTTP: ');
      console.dir(err);
    }
    cb(new Error('HTTP: ' + err.message));
  });

  if (fn.isReadStream(raw)) {
    var stream = raw;
    stream.pipe(req);

    stream.on('data', function (chunk) {
      //console.log(chunk.toString())
    });

    stream.on('end', function () {
      req.end();
    });

    stream.on('error', function (err) {
      cb(new Error('Stream: ' + err.message));
    });
  } else {
    if (raw.length > 0) {
      req.write(raw); 
    }

    req.end();
  }
};

module.exports = Request;
