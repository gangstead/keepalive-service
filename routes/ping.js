'use strict';

exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/ping',
    handler(req, reply) {
      const pkg = require('../package.json');

      reply({
        name: pkg.name,
        version: pkg.version
      });
    }
  });
  next();
};

exports.register.attributes = {
  name: `${require('../package.json').name }-ping-route`,
  version: require('../package.json').version
};
