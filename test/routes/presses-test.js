'use strict';

const _ = require('lodash');
const authHeader = require('../utils/auth').noauthHeader;
const expect = require('chai').expect;
const fakes = require('../utils/fakes');
const serverSetup = require('../utils/server-setup');

describe('Presses route', () => {
  let server;
  let knex;
  let userLogin;

  before(() => {
    return serverSetup()
      .then((s) => {
        server = s;
        knex = s.plugins.db.knex;
        userLogin = s.plugins.userLogin;
      });
  });

  beforeEach(() => server.clearDb());

  describe('POST /presses', () => {
    it('should register presses', () => {
      const user = fakes.user();
      const button = fakes.button({ user_id: user.id });

      return userLogin.create(user)
        .then(() => knex('buttons').insert(button))
        .then(() => server.inject({
          method: 'POST',
          url: '/presses',
          headers: authHeader(user),
          payload: {
            press: {
              buttonId: button.id
            }
          }
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.press');
          expect(res.result.press).to.have.all.keys([ 'id', 'userId', 'buttonId', 'pressTime' ]);
          return knex('presses');
        })
        .then((presses) => {
          expect(presses).to.have.property('length', 1);
        });
    });

    it('should 401 if not authorized', () => {
      const user = fakes.user();
      const button = fakes.button({ user_id: user.id });

      return server
        .inject({
          method: 'POST',
          url: '/buttons',
          headers: authHeader(user),
          payload: {
            press: {
              buttonId: button.id
            }
          }
        })
        .then((res) => {
          expect(res).to.have.property('statusCode', 401);
          return knex('presses');
        })
        .then((presses) => {
          expect(presses).to.have.property('length', 0);
        });
    });
  });

  describe('GET /presses/{pressId}', () => {
    it('should retrieve a press', () => {
      const user = fakes.user();
      const button = fakes.button({ user_id: user.id });
      const press = fakes.press({ user_id: user.id, button_id: button.id });

      return knex('users').insert(user)
        .then(() => knex('buttons').insert(button))
        .then(() => knex('presses').insert(press))
        .then(() => server.inject({
          url: `/presses/${press.id}`
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.press');
          expect(res.result.press).to.have.all.keys([ 'id', 'userId', 'buttonId', 'pressTime' ]);
        });
    });

    xit('should 401 if not authorized'); // TODO: for when authentication is implemented
  });

  describe('GET /buttons/{buttonId}/presses', () => {
    it("should retrieve a button's presses", () => {
      const user = fakes.user();
      const button = fakes.button({ user_id: user.id });
      const presses = _.times(3, () => fakes.press({ user_id: user.id, button_id: button.id }));

      return knex('users').insert(user)
        .then(() => knex('buttons').insert(button))
        .then(() => knex('presses').insert(presses))
        .then(() => server.inject({
          url: `/buttons/${button.id}/presses`
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.presses');
          expect(res).to.have.deep.property('result.presses.length');
        });
    });

    xit('should 401 if not authorized'); // TODO: for when authentication is implemented
  });
});
