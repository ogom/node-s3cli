/*!
 * s3cli - cli helper
 * Copyright(c) 2012 ogom
 * MIT Licensed
 */
'use strict';

var program = require('commander'),
    eyes = require('eyes'),
    table = require('cli-table'),
    configure = require('./configure'),
    utils = require('./utils'),
    s3 = require('..');

/**
 * CLI Helper
 */
function Helper() {}

Helper.prototype.program = program;
Helper.prototype.configure = configure;
Helper.prototype.config = configure.read();

/**
 * Create client
 * @return {Client} S3 client.
 */
Helper.prototype.client = function () {
  this.config.eyes = this.program.eyes;
  this.config.debug = this.program.debug;
  return s3.createClient(this.config);
};

/**
 * Error output
 * @param  {Object} err Error message.
 */
Helper.prototype.error = function (err) {
  console.error('ERROR: ' + err.message);
};

/**
 * Sub command
 * @param  {Object} commands Commands.
 * @param  {String} name     Command name.
 * @return {Command}         Program command.
 */
Helper.prototype.subcommand = function (commands, name) {
  for (var i = 0, n = commands.length; i < n; i++) {
    if (commands[i]._name === name) break;
  }
  return commands[i];
};

/**
 * Output
 * @param  {Object} res      HTTP response.
 * @param  {Object} options  {message:..., table: h or v, include: [...], exclude: [...]}
 */
Helper.prototype.output = function (err, res, options) {
  options = options || {}; 

  if (err) {
    console.log(err.message);
    process.exit(1);
  }

  if (this.program.raw) {
    console.log(res.body);
  } else {
    if (options.message) {
      console.log(options.message);
    } else {
      if (res.content) {
        if (this.program.eyes) {
          eyes.inspect(res.content);
        } else {
          var content = utils.object_depth(res.content, options.content);
          if (options.table === 'v') {
            this.vertical(content, options);
          } else {
            this.horizontal(content, options);
          }
        }
      } else {
        console.log(res.body);
      }
    }
  }
};

/**
 * Table horizontal
 * @param  {Object} content Output content.
 * @param  {Object} options    Include or Exclude.
 */
Helper.prototype.horizontal = function (content, options) {
  if (content.length > 0) {
    var t = new table();

    options.exclude = options.exclude || [];
    content.forEach(function (cols) {
      for (var i = 0, n = options.exclude.length; i < n; i++) {
        delete cols[options.exclude[i]];
      }
      t.push(utils.object_values(cols));
    });

    t.options.head = Object.keys(content[0]);
    console.log(t.toString());
  }
};

/**
 * Table vertical
 * @param  {Object} content Output content.
 * @param  {Object} options    Include or Exclude.
 */
Helper.prototype.vertical = function (content, options) {
  var t = new table();
  options.include = options.include || [];

  Object.keys(content).forEach(function (key) {
    if (options.include.length > 0 ) {
      if (options.include.indexOf(key) !== -1) {
        t.push([key, content[key]]);
      }
    } else {
      t.push([key, content[key]]);
    }
  });

  t.options.head = ['key', 'value'];
  console.log(t.toString());
};

module.exports = new Helper;
