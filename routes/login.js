'use strict';

const Boom = require('boom');
const Joi = require('joi');

exports.register = (server, options, next) => {
  const userLogin = server.plugins.userLogin;

  server.route({
    method: 'POST',
    path: '/login',
    config: {
      validate: {
        payload: {
          login: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
          })
        }
      }
    },
    handler(req, reply) {
      const p = userLogin.login(req.payload.login)
        .then((user) => {
          if (user) {
            return { user };
          }
          throw Boom.unauthorized();
        });

      reply(p);
    }
  });

  next();
};

exports.register.attributes = {
  name: `${require('../package.json').name }-login-route`,
  version: require('../package.json').version
};
