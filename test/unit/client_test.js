'use strict';

require('../mock/request');
var s3 = require('../../');
var client = s3.createClient({host_base: 'example.com'});

    
describe('client', function() {

  describe('#service', function() {
    describe('#buckets', function() {
      it ('should have buckets.', function(done) {
        client.service.buckets(function (err, res) {
          res.content.should.have.property('buckets')
          done();
        });
      });
    });
  });

  describe('#buckets', function() {
    describe('#create', function() {
      it ('should be equal a bucket.', function(done) {
        client.buckets.create('bucket01', function (err, res) {
          res.headers.location.should.be.equal('/bucket01')
          done();
        });
      });
    });
  });

  describe('#buckets', function() {
    describe('#destroy', function() {
      it ('should be equal 204 of status.', function(done) {
        client.buckets.destroy('bucket01', function (err, res) {
          res.status.should.be.equal(204)
          done();
        });
      });
    });
  });

  describe('#buckets', function() {
    describe('#objects', function() {
      it ('should have objects.', function(done) {
        client.buckets.objects('bucket01', {}, function (err, res) {
          res.content.should.have.property('contents')
          done();
        });
      });
    });
  });

  describe('#objects', function() {
    describe('#create', function() {
      it ('should be equal 200 of status.', function(done) {
        client.objects.create('bucket01', 'object01.txt', 'value', {}, function (err, res) {
          res.status.should.be.equal(200)
          done();
        });
      });
    });
  });

  describe('#objects', function() {
    describe('#read', function() {
      it ('should be equal 123 of body.', function(done) {
        client.objects.read('bucket01', 'object01.txt', function (err, res) {
          res.body.should.be.equal('123')
          done();
        });
      });
    });
  });

  describe('#objects', function() {
    describe('#destroy', function() {
      it ('should be equal 204 of status.', function(done) {
        client.objects.destroy('bucket01', 'object01.txt', function (err, res) {
          res.status.should.be.equal(204)
          done();
        });
      });
    });
  });
});
