'use strict';

const jwt = require('jsonwebtoken');

module.exports = {
  noauthHeader: (user) => ({
    authorization: `Basic ${new Buffer(`${user.email}:${user.password}`).toString('base64')}`
  }),
  jwtHeader: (user) => ({
    authorization: `Bearer ${jwt.sign(user, process.env.JWT_SECRET, { algorithm: 'HS256' })}`
  })
};
