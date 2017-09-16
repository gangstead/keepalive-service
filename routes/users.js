'use strict';

const _ = require('lodash');
const Boom = require('boom');
const Joi = require('joi');

exports.register = (server, options, next) => {
  const userLogin = server.plugins.userLogin;

  const sanitizeUser = (u) => _.merge(u, {
    name: _.startCase(u.name),
    email: u.email.toLowerCase()
  });

  const formatUser = (u) => ({
    id: u.id,
    name: u.name,
    email: u.email
  });

  server.route({
    method: 'POST',
    path: '/users',
    config: {
      validate: {
        payload: {
          user: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().regex(userLogin.PASSWORD_STRENGTH, 'password strength').required()
          })
        }
      }
    },
    handler(req, reply) {
      const u = sanitizeUser(req.payload.user);

      const p = userLogin.create(u)
        .then((newU) => ({
          user: formatUser(newU)
        }))
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
