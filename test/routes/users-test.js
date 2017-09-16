'use strict';

const _ = require('lodash');
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
      const newUser = fakes.newUser();
      return server
        .inject({
          method: 'POST',
          url: '/users',
          payload: {
            user: newUser
          }
        })
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.user');
          expect(res.result.user).to.have.all.keys([ 'id', 'name', 'email' ]);
          expect(res.result.user).to.not.have.key('password');
          return knex('users');
        })
        .then((users) => {
          expect(users).to.have.property('length', 1);
          expect(users[0]).to.have.property('name', _.startCase(newUser.name));
          expect(users[0]).to.have.property('password').not.equal(newUser.password);
        });
    });

    it('should not allow duplicate emails', () => {
      const user1 = fakes.newUser();
      const user2 = _.assign(fakes.newUser(), { email: user1.email.toUpperCase() });
      return server
        .inject({
          method: 'POST',
          url: '/users',
          payload: {
            user: user1
          }
        })
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
        })
        .then(() => server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            user: user2
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

    it('should not allow weak password', () => {
      const user = _.assign(fakes.newUser(), { password: 'weak password game' });
      return server
        .inject({
          method: 'POST',
          url: '/users',
          payload: {
            user
          }
        })
        .then((res) => {
          expect(res).to.have.property('statusCode', 400);
          return knex('users');
        })
        .then((users) => {
          expect(users).to.have.property('length', 0);
        });
    });
  });
});
