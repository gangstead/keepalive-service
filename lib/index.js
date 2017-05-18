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
    .then(() => server.register([
      require('../routes/alerts'),
      require('../routes/buttons'),
      require('../routes/login'),
      require('../routes/presses'),
      require('../routes/schedules'),
      require('../routes/users'),
      require('../routes/stats')
    ]
    ))
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
  s.connection({
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
    s.start();
    s.log(`Server started at ${s.info.uri}`);
  })
  .catch((err) => console.error('Server startup err', err));
};

module.exports = {
  server,
  setup
};
