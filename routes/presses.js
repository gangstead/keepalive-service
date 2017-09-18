'use strict';

const _ = require('lodash');
const Joi = require('joi');

exports.register = (server, options, next) => {
  const knex = server.plugins.db.knex;

  const formatPress = (p) => _.mapKeys(p, (v, k) => _.camelCase(k));

  server.route({
    method: 'POST',
    path: '/presses',
    config: {
      auth: 'jwt',
      validate: {
        payload: {
          press: Joi.object({
            buttonId: Joi.string().required()
          })
        }
      }
    },
    handler(req, reply) {
      const press = {
        user_id: req.auth.credentials.user.id,
        button_id: req.payload.press.buttonId
      };
      const p = knex('presses')
        .insert(press)
        .returning('*')
        .spread((pr) => ({ press: formatPress(pr) }));

      reply(p);
    }
  });

  server.route({
    method: 'GET',
    path: '/presses/{pressId}',
    config: {
      validate: {
        params: {
          pressId: Joi.string().guid()
        }
      }
    },
    handler(req, reply) {
      const p = knex('presses')
        .first('*')
        .where('id', req.params.pressId)
        .then((pr) => ({ press: formatPress(pr) }));

      reply(p);
    }
  });

  server.route({
    method: 'GET',
    path: '/buttons/{buttonId}/presses',
    config: {
      validate: {
        params: {
          buttonId: Joi.string().guid()
        }
      }
    },
    handler(req, reply) {
      const p = knex('presses')
        .first('*')
        .where('button_id', req.params.buttonId)
        .then((prs) => ({ presses: _.map(prs, formatPress) }));

      reply(p);
    }
  });

  next();
};

exports.register.attributes = {
  name: `${require('../package.json').name }-presses-route`,
  version: require('../package.json').version
};
