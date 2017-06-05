'use strict';

const _ = require('lodash');
const Joi = require('joi');

exports.register = (server, options, next) => {
  const knex = server.plugins.db.knex;

  const formatButton = (b) => _.mapKeys(b, (v, k) => _.camelCase(k));

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
        .then((bs) => ({ buttons: _.map(bs, formatButton) }));

      reply(p);
    }
  });

  server.route({
    method: 'POST',
    path: '/buttons',
    config: {
      auth: 'noauth',
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
      const button = _.merge(req.payload.button, { user_id: req.auth.credentials.user.id });
      const p = knex('buttons')
        .insert(button)
        .returning('*')
        .spread((b) => ({ button: formatButton(b) }));
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
        .then((b) => ({ button: formatButton(b) }));

      reply(p);
    }
  });

  next();
};

exports.register.attributes = {
  name: `${require('../package.json').name }-buttons-route`,
  version: require('../package.json').version
};
