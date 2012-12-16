s3cli
=====

s3cli is [S3](http://aws.amazon.com/s3/) client and S3 Command Line Interface.  
inspired by Python's [s3cmd](https://github.com/s3tools/s3cmd).  


## S3 compatible service

* [RiakCS](http://basho.com/products/riakcs/)


## Features

* Response content is JSON.
* Debug output Request and Response.
* Output style is Table or XML or Eyes.
* CLI is sub command style.


## Installation

```
$ npm install s3cli -g
```


## Usage

### CLI
Invoke interactive configuration.

```
$ s3cli init
$ s3cli mb bucket
$ s3cli use bucket
$ s3cli set object value
```

#### Output XML
XML is set to body of response.

```
$ s3cli lb --raw
```


#### Bucket use
Set to config the Bucket name.

```
$ s3cli lb
$ s3cli use bucket
$ s3cli get object
```


#### Recursively
Remove the object recursively

```
$ s3cli rb bucket
The bucket you tried to delete is not empty
$ s3cli rb bucket -R
Object 'bucket/object' removed
Bucket 'bucket' removed
```

### Program
JSON is set to content of response.

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

[![Build Status](https://travis-ci.org/ogom/node-s3cli.png?branch=master)](https://travis-ci.org/ogom/node-s3cli)


## Licence

* MIT
