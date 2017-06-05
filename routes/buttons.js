'use strict';

const Joi = require('joi');

exports.register = (server, options, next) => {
  const knex = server.plugins.db.knex;

  server.route({
    method: 'GET',
    path: '/buttons',
    config: {
      validate: {
        query: {
          type: Joi.string()
        }
      }
    },
    handler(req, reply) {
      const p = knex('buttons')
        .where((qb) => {
          if (req.query.type) {
            qb.where('type', req.query.type);
          }
        })
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
