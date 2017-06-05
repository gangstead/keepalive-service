'use strict';

const expect = require('chai').expect;
const fakes = require('../utils/fakes');
const serverSetup = require('../utils/server-setup');

describe('Users route', () => {
  let server;
  let knex;

  before(() => {
    return serverSetup()
      .then((s) => {
        server = s;
        knex = s.plugins.db.knex;
      });
  });

  beforeEach(() => server.clearDb());

  describe('POST /users', () => {
    it('should create user', () => {
      return server
        .inject({
          method: 'POST',
          url: '/users',
          payload: {
            user: {
              name: 'steven gangstead',
              email: 'steven@gangstead.com'
            }
          }
        })
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.user');
          expect(res.result.user).to.have.all.keys([ 'id', 'name', 'email' ]);
          return knex('users');
        })
        .then((users) => {
          expect(users).to.have.property('length', 1);
          expect(users).to.have.deep.property('[0].name', 'Steven Gangstead');
        });
    });

    it('should not allow duplicate emails', () => {
      const user = fakes.user();
      return server
        .inject({
          method: 'POST',
          url: '/users',
          payload: {
            user: {
              name: user.name,
              email: user.email
            }
          }
        })
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
        })
        .then(() => server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            user: {
              name: 'steven gangstead',
              email: user.email.toUpperCase()
            }
          }
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 409);
          return knex('users');
        })
        .then((users) => {
          expect(users).to.have.property('length', 1);
        });
    });
  });
});
