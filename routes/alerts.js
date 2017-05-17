'use strict';

exports.register = (server, options, next) => {
  // const knex = server.plugins.db.knex;

  next();
};

exports.register.attributes = {
  name: `${require('../package.json').name }-alerts-route`,
  version: require('../package.json').version
};
