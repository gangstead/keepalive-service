'use strict';

exports.register = (server, options, next) => {
  const knex = server.plugins.db.knex;

  server.route({
    method: 'GET',
    path: '/buttons',
    handler(req, reply) {
      const p = knex('buttons')
        .then((buttons) => ({ buttons }));

      reply(p);
    }
  });

  server.route({
    method: 'POST',
    path: '/buttons',
    handler(req, reply) {
      reply();
    }
  });

  server.route({
    method: 'GET',
    path: '/users/{userId}/buttons',
    handler(req, reply) {
      reply('buttons');
    }
  });

  server.route({
    method: 'POST',
    path: '/users/{userId}/buttons',
    handler: (req, reply) => {
      reply();
    }
  });

  server.route({
    method: 'GET',
    path: '/buttons/{buttonId}',
    handler(req, reply) {
      reply('buttons');
    }
  });

  next();
};

exports.register.attributes = {
  name: `${require('../package.json').name }-buttons-route`,
  version: require('../package.json').version
};
