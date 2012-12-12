'use strict';

var auth = require('../../lib/s3/auth');

describe('auth', function() {
  describe('#sign', function() {

    it('Should create authorization.', function() {
      var request = {method: 'GET', path: '/', headers: {data: new Date('1999, 11, 31, 23, 59, 59').toUTCString()}};
      var options = {access_key: 'abc', secret_key: '123'};
      var authorization = auth.sign(request, options);
      authorization.should.equal('AWS abc:0JrJNO7It+LR+BDCqg5Wm+MhNYw=');
    });

  });
});
