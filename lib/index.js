'use strict';

const Hapi = require('hapi');
const config = require('../config/config.js');
const server = new Hapi.Server();

server.connection({
  port: config.server.port,
  routes: {
    cors: true
  }
});

const goodOptions = {
  opsInterval: 1000,
  reporters: [{
    reporter: require('good-console'),
    events: { log: '*', response: '*' }
  }]
};

server.register({
  register: require('good'),
  options: goodOptions
}).then(() => server.register(require('../plugins/db'))
  ).then(() => server.register({
    register: require('../routes/buttons'),
    options: config.server.options
  })).then(() => server.register([
    require('inert'),
    require('vision'),
    require('hapi-swagger'),
    require('blipp')
  ])).then(() => {
    server.start();
    server.log(`Server started at ${server.info.uri}`);
  })
  .catch((err) => console.log('Server startup err', err)); // eslint-disable-line no-console
