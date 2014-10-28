'use strict';

var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;
var afterEach = lab.afterEach;

var expect = require('code').expect;

var hapi = require('hapi');
var hapiAuthBasic = require('hapi-auth-basic');

var hapiStrategy = require('../');

describe('plugin', function(){

  var server;

  beforeEach(function(done){
    server = hapi.createServer();
    done();
  });

  afterEach(function(done){
    server = null;
    done();
  });

  it('will register authentication strategies for already registered schemes', function(done){
    var config = {
      strategy: {
        name: 'basicAuth',
        scheme: 'basic',
        options: {
          validateFunc: function(){}
        }
      }
    };

    server.pack.register([
      { plugin: hapiAuthBasic },
      { plugin: hapiStrategy, options: config }
    ], done);
  });

  it('will register authentication strategies with a mode', function(done){
    var config = {
      strategy: {
        name: 'basicAuth',
        scheme: 'basic',
        mode: 'try',
        options: {
          validateFunc: function(){}
        }
      }
    };

    server.pack.register([
      { plugin: hapiAuthBasic },
      { plugin: hapiStrategy, options: config }
    ], done);
  });

  it('can register multiple strategies when given the `strategies` options', function(done){
    var config = {
      strategies: [
        {
          name: 'basicAuth',
          scheme: 'basic',
          options: {
            validateFunc: function(){}
          }
        },
        {
          name: 'basicAuth2',
          scheme: 'basic',
          options: {
            validateFunc: function(){}
          }
        }
      ]
    };

    server.pack.register([
      { plugin: hapiAuthBasic },
      { plugin: hapiStrategy, options: config }
    ], done);
  });

  it('will register a auth-scheme plugin before registering strategies if given a `plugins` option', function(done){
    var config = {
      plugins: {
        plugin: hapiAuthBasic
      },
      strategy: {
        name: 'basicAuth',
        scheme: 'basic',
        options: {
          validateFunc: function(){}
        }
      }
    };

    server.pack.register({
      plugin: hapiStrategy,
      options: config
    }, done);
  });

  it('will fail registering invalid auth-scheme plugins', function(done){
    var config = {
      plugins: {
        name: 'fail',
        register: function(plugin, options, next){
          next(new Error('Failed'));
        }
      },
      strategy: {
        name: 'basicAuth',
        scheme: 'basic',
        options: {
          validateFunc: function(){}
        }
      }
    };

    server.pack.register({
      plugin: hapiStrategy,
      options: config
    }, function(err){
      expect(err).to.exist();
      done();
    });
  });
});
