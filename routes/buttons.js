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
    config: {
      validate: {
        payload: {
          button: Joi.object({
            name: Joi.string().required(),
            type: Joi.string().required()
          })
        }
      }
    },
    handler(req, reply) {
      const p = knex('buttons')
        .insert(req.payload.button)
        .returning('*')
        .spread((button) => ({ button }));
      reply(p);
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
    config: {
      validate: {
        params: {
          buttonId: Joi.string().guid()
        }
      }
    },
    handler(req, reply) {
      const p = knex('buttons')
        .first('*')
        .where('id', req.params.buttonId)
        .then((button) => ({ button }));

      reply(p);
    }
  });

  next();
};

exports.register.attributes = {
  name: `${require('../package.json').name }-buttons-route`,
  version: require('../package.json').version
};
