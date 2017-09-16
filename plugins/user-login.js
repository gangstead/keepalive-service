'use strict';

const _ = require('lodash');

exports.register = (server, options, next) => {
  const knex = server.plugins.db.knex;

  server.expose({
    PASSWORD_STRENGTH: // 1 each upper, lower, number, special. length > 10
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*(?=.[!@#\$%\^&\*()\-_+={}\[\]\\\|~`;:"'.,\/<>?])).{10,72}$/,
    create(user) {
      return knex('users')
        .insert(_.merge({},
          user,
          { password: knex.raw("crypt(?, gen_salt('bf', 9))", [ user.password ]) }
        ), '*')
        .get(0);
    },
    login(user) {
      return knex
        .first()
        .from('users')
        .where({
          email: user.email,
          password: knex.raw('crypt(?, password)', [ user.password ]),
          deleted_at: null
        });
    }
  });

  next();
};

exports.register.attributes = {
  name: 'userLogin'
};
