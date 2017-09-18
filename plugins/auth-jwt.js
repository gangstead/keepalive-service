'use strict';

const Boom = require('boom');
const Joi = require('joi');

exports.register = (server, options, next) => {
  const knex = server.plugins.db.knex;

  const jwtSchema = Joi.object({
    user: Joi.object({
      email: Joi.string().email().lowercase().required()
    }).unknown()
  }).unknown();

  const validateFunc = (decoded, request, callback) => {
    const { error: validateError, value: validatedJwt } = Joi.validate(decoded, jwtSchema);

    if (validateError) {
      server.log([ 'jwt' ], validateError);
      return callback(Boom.badRequest('Did you mess with the JWT?'));
    }
    return knex('users')
      .first()
      .where('email', validatedJwt.user.email)
      .then((user) => {
        if (!user) {
          return callback(null, false);
        }

        return callback(null, true, { user });
      });
  };

  server.register(require('hapi-auth-jwt2'))
    .then(() => {
      server.auth.strategy('jwt', 'jwt',
        {
          key: process.env.JWT_SECRET,
          validateFunc,
          verifyOptions: { algorithms: [ 'HS256' ] }
        });
      next();
    });
};

exports.register.attributes = {
  name: 'auth-jwt'
};
