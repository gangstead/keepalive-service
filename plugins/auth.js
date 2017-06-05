'use strict';

const hapiAuthBasic = require('hapi-auth-basic');

exports.register = (server, options, next) => {
  const knex = server.plugins.db.knex;

  // TODO: Actual Auth.  This just returns if you put in a valid user id
  const validate = (request, username, password, callback) => {
    return knex('users')
      .first('*')
      .where('id', username)
      .then((user) => {
        if (!user) {
          return callback(null, false);
        }

        return callback(null, true, { user });
      });
  };
  server.register(hapiAuthBasic)
    .then(() => {
      server.auth.strategy('noauth', 'basic', { validateFunc: validate });
      next();
    });
};

exports.register.attributes = {
  name: 'auth'
};
