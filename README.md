s3cli
=====

s3cli is S3 client and S3 Command Line Interface.  
inspired by Python's [s3cmd](https://github.com/s3tools/s3cmd).  

## S3 and Compatible service
* [S3](http://aws.amazon.com/s3/)
* [RiakCS](http://basho.com/products/riakcs/)

## Installation

```
$ npm install s3cli -g
```

## Usage

### CLI

```
$ s3cli init
$ s3cli mb bucket
$ s3cli use bucket
$ s3cli set object value
```

### Program

```
// create client
var s3 = require('s3cli');
var client = s3.createClient({
  host_base: 's3.amazonaws.com',
  access_key: 'ACCESSKEY',
  secret_key: 'SECRETKEY'
});

// bucket list
client.service.buckets(function (err, res) {
  console.dir(res.content.buckets.bucket);
});

// Make bucket
client.buckets.create('bucket', function (err, res) {
  console.log(res.status);
});
  
// Remove bucket
client.buckets.destroy('bucket', function (err, res) {
  console.log(res.status);
});

// object list
client.buckets.objects('bucket', {prefix: 'a', delimiter: '/'}, function (err, res) {
  console.dir(res.content.content);
});

// Set value of a object from bucket
client.objects.create('bucket', 'object', 'value', {}, function (err, res) {
  console.log(res.status);
});

// Get value of a object from bucket
client.objects.read('bucket', 'object', function (err, res) {
  console.log(res.body);
});

// Delete a object from bucket
client.objects.destroy('bucket', 'object', function (err, res) {
  console.log(res.status);
});
```

## Tests

```
$ make test
```

[![Build Status](https://secure.travis-ci.org/ogom/node-s3cli.png?branch=master)](http://travis-ci.org/ogom/node-s3cli)


## Licence
* MIT
