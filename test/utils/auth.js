'use strict';

module.exports = {
  noauthHeader: (user) => ({
    authorization: `Basic ${new Buffer(`${user.email}:${user.password}`).toString('base64')}`
  })
};
