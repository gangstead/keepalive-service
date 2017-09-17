'use strict';

const expect = require('chai').expect;
const fakes = require('../utils/fakes');
const jwt = require('jsonwebtoken');
const serverSetup = require('../utils/server-setup');

describe('Login route', () => {
  let server;
  // let knex;
  let userLogin;

  before(() => {
    return serverSetup()
      .then((s) => {
        server = s;
        // knex = s.plugins.db.knex;
        userLogin = s.plugins.userLogin;
      });
  });

  beforeEach(() => server.clearDb());

  describe('POST /login', () => {
    it('should login and return a jwt', () => {
      const user = fakes.user();

      return userLogin.create(user)
        .then(() => server.inject({
          method: 'POST',
          url: '/login',
          payload: {
            login: {
              email: user.email,
              password: user.password
            }
          }
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.user');
          expect(res.result.user).to.have.all.keys([ 'id', 'name', 'email', 'token' ]);
          expect(res.result.user).to.not.have.key('password');
          expect(() => jwt.verify(res.result.user.token, process.env.JWT_SECRET)).to.not.throw();
        });
    });

    it('should not let an unknown user in', () => {
      const user = fakes.user(); // new user not saved to db

      return server.inject({
        method: 'POST',
        url: '/login',
        payload: {
          login: {
            email: user.email,
            password: user.password
          }
        }
      })
      .then((res) => {
        expect(res).to.have.property('statusCode', 401);
      });
    });

    it('should not let a user with a bad password in', () => {
      const user = fakes.user();

      return userLogin.create(user)
        .then(() => server.inject({
          method: 'POST',
          url: '/login',
          payload: {
            login: {
              email: user.email,
              password: 'notmypassword'
            }
          }
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 401);
        });
    });
  });
});
