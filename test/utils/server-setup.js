'use strict';

const hapi = require('hapi');
const clearDb = require('./clear-db');

module.exports = () => {
  const options = {
    // debug: { request: [ '*' ], log: [ '*' ] } // uncomment to send logs to console
  };

  const server = new hapi.Server(options);
  server.connection({
    routes: {
      cors: true
    }
  });

  return require('../../lib/index')
    .setup(server)
    .tap(() => {
      server.clearDb = () => clearDb(server.plugins.db.knex);
      return server.initialize();
    });
};
