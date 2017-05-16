'use strict';

global.Promise = require('bluebird').Promise;

const Hapi = require('hapi');
const config = require('../config/config.js');

const goodOptions = {
  ops: {
    interval: 1000
  },
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{
        response: '*',
        log: '*'
      }]
    }, {
      module: 'good-console'
    }, 'stdout' ]
  }
};

const setup = (server) => {
  return server
    .register(require('../plugins/db'))
    .then(() => server.register({
      register: require('../routes/buttons'),
      options: config.server.options
    }))
    .then(() => server.register([
      require('inert'),
      require('vision'),
      require('hapi-swagger'),
      require('blipp')
    ]))
    .then(() => {
      server.log([ 'info' ], 'Server Setup Complete');
      return server;
    });
};

const server = () => {
  const s = new Hapi.Server();
  server.connection({
    port: config.server.port,
    routes: {
      cors: true
    }
  });

  return s.register({
    register: require('good'),
    options: goodOptions
  })
  .then(() => setup(s))
  .then(() => {
    server.start();
    server.log(`Server started at ${server.info.uri}`);
  })
  .catch((err) => console.error('Server startup err', err));
};

module.exports = {
  server,
  setup
};
