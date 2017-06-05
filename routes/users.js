'use strict';

const _ = require('lodash');
const Boom = require('boom');
const Joi = require('joi');

exports.register = (server, options, next) => {
  const knex = server.plugins.db.knex;

  const sanitizeUser = (u) => _.merge(u, {
    name: _.startCase(u.name),
    email: u.email.toLowerCase()
  });

  server.route({
    method: 'POST',
    path: '/users',
    config: {
      validate: {
        payload: {
          user: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required()
          })
        }
      }
    },
    handler(req, reply) {
      const u = sanitizeUser(req.payload.user);

      const p = knex('users')
        .insert(u)
        .returning('*')
        .spread((user) => ({ user }))
        .catch((e) => e.constraint === 'users_email_unique',
          () => {
            throw Boom.conflict('Email already registered');
          });

      reply(p);
    }
  });

  next();
};

exports.register.attributes = {
  name: `${require('../package.json').name }-users-route`,
  version: require('../package.json').version
};
