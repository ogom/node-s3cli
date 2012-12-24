/*!
 * s3cli - configure
 * Copyright(c) 2012 ogom
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
    path = require('path'),
    program = require('commander');

var crlf = new RegExp(/\n|\r|\r\n/),
    div = new RegExp(/\s+=\s+/);

/**
 * Configure
 */
function Configure() {
  this.filename = path.join(__dirname, '../.s3cli');
  if (!fs.existsSync(this.filename)) {
    this.filename = path.join(process.env.HOME, '.s3cli');
  }
}

/**
 * config read
 * @return {Object} Read config.
 */
Configure.prototype.read = function () {
  var config = {};

  if (fs.existsSync(this.filename)) {
    var rows = fs.readFileSync(this.filename, 'utf-8').toString().split(crlf);
    rows.forEach(function (row) {
      var col = row.split(div);
      if (col[1]) config[col[0]] = col[1];
    });
  }

  return config;
};

/**
 * config write
 * @param  {Object} config Write object.
 */
Configure.prototype.write = function (config) {
  var rows = ['[default]'];

  for (var key in config) {
    rows.push(key + ' = ' + config[key]);
  }

  fs.writeFileSync(this.filename, rows.join('\n'));
};

/**
 * config init
 * @param  {Function} cb Callback.
 */
Configure.prototype.init = function (cb) {
  var self = this;
  var config = this.read();

  config.host_base = config.host_base || 's3.amazonaws.com';
  config.send_chunk = config.send_chunk || 4096;

  var output = "\
  .                  .          \n\
 / \\                 |    o    \n\
|\\ /| .--. .--.  .-. |    .    \n\
| | | `--.  --: (    |    |     \n\
 \\|/  `--' `--'  `-' `- -' `-  \n\
  '   S3 Command Line Interface \n\
      http://aws.amazon.com/s3/ \n\
";
  console.log(output);

  console.log('Hostname for s3 or compatible');
  program.prompt('Hostname (' + config.host_base + '): ', function (host_base) {
    config.host_base = host_base || config.host_base;
    config.host_bucket = '%(bucket)s.' + config.host_base;

    console.log();
    console.log('Access key and Secret key are your identifiers for s3 or compatible');
    program.prompt('Access Key: ', function (key) {
      config.access_key = key || config.access_key;

      program.prompt('Secret Key: ', function (key) {
        config.secret_key = key || config.secret_key;


        console.log();
        program.confirm('Use HTTPS protocol? (yes or no) ', function (ok) {
          console.log();
          if (ok) {
            config.use_https = 'True';
          } else {
            config.use_https = 'False';
          }

          console.log();
          console.log('New settings:');
          console.log('Hostname: %s', config.host_base);          
          console.log('Access Key: %s', config.access_key);
          console.log('Secret Key: %s', config.secret_key);
          console.log('Use HTTPS protocol: %s', config.use_https);

          console.log();
          program.confirm('Save settings? (yes or no) ', function (ok) {
            console.log();
            if (ok) {
              self.write(config);
            }
            cb();
          });
        });
      });
    });
  });
};

module.exports = new Configure;
