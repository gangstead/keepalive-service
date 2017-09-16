'use strict';

const hapiAuthBasic = require('hapi-auth-basic');

exports.register = (server, options, next) => {
  const userLogin = server.plugins.userLogin;

  // TODO: Actual Auth.  Basic auth is just a placeholder
  const validate = (request, username, password, callback) => {
    return userLogin.login({ email: username, password })
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
