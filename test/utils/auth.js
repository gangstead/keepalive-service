'use strict';

module.exports = {
  noauthHeader: (user) => ({
    authorization: `Basic ${new Buffer(`${user.id}:nopassword`).toString('base64')}`
  })
};
