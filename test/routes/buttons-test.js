'use strict';

const _ = require('lodash');
const jwtHeader = require('../utils/auth').jwtHeader;
const expect = require('chai').expect;
const fakes = require('../utils/fakes');
const moment = require('moment');
const serverSetup = require('../utils/server-setup');

describe('Buttons route', () => {
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

  describe('GET /buttons', () => {
    it('should return buttons for all users', () => {
      const users = _.times(2, fakes.user);
      const buttons = _.times(4, (i) => fakes.button({ user_id: users[i % 2].id }));

      return knex('users').insert(users)
        .then(() => knex('buttons').insert(buttons))
        .then(() => server.inject({
          url: '/buttons'
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.buttons.length', 4);
        });
    });

    it('should return buttons filtered by type', () => { // FIXME
      const users = _.times(2, fakes.user);
      const buttons = _.times(4, (i) => fakes.button({ user_id: users[i % 2].id }));
      const bttn = fakes.button({ type: 'specialButton', user_id: users[0].id });

      return knex('users').insert(users)
        .then(() => knex('buttons').insert([ bttn, ...buttons ]))
        .then(() => server.inject({
          url: {
            pathname: '/buttons',
            query: { type: 'specialButton' }
          }
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.buttons.length', 1);
        });
    });

    it('should return an empty array if no buttons match the filter', () => { // FIXME
      const users = _.times(2, fakes.user);
      const buttons = _.times(4, (i) => fakes.button({ user_id: users[i % 2].id }));

      return knex('users').insert(users)
        .then(() => knex('buttons').insert(buttons))
        .then(() => server.inject({
          url: {
            pathname: '/buttons',
            query: { type: 'specialButton' }
          }
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.buttons.length', 0);
        });
    });

    xit('should 401 if not authorized'); // TODO: for when authentication is implemented
  });

  describe('POST /buttons', () => {
    it('should create buttons', () => {
      const user = fakes.user();

      return userLogin.create(user)
        .then(() => server.inject({
          method: 'POST',
          url: '/buttons',
          headers: jwtHeader({ user }),
          payload: {
            button: {
              name: 'mybutton',
              type: 'bttn'
            }
          }
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.button');
          expect(res.result.button).to.have.all.keys([ 'id', 'name', 'type', 'userId' ]);
          return knex('buttons');
        })
        .then((buttons) => {
          expect(buttons).to.have.property('length', 1);
          expect(buttons).to.have.deep.property('[0].name', 'mybutton');
        });
    });

    it('should 401 if not authorized', () => {
      const user = fakes.user();

      return server
        .inject({
          method: 'POST',
          url: '/buttons',
          headers: jwtHeader({ user }),
          payload: {
            button: {
              name: 'mybutton',
              type: 'bttn'
            }
          }
        })
        .then((res) => {
          expect(res).to.have.property('statusCode', 401);
          return knex('buttons');
        })
        .then((buttons) => {
          expect(buttons).to.have.property('length', 0);
        });
    });

    it('should not accept old token', () => {
      const user = fakes.user();

      return userLogin.create(user)
        .then(() => server.inject({
          method: 'POST',
          url: '/buttons',
          headers: jwtHeader({
            user,
            exp: moment().subtract(1, 'hour').unix()
          }),
          payload: {
            button: {
              name: 'mybutton',
              type: 'bttn'
            }
          }
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 401);
          return knex('buttons');
        })
        .then((buttons) => {
          expect(buttons).to.have.property('length', 0);
        });
    });
  });

  describe('GET /buttons/{buttonId}', () => {
    it('should retrieve a button', () => {
      const user = fakes.user();
      const button = fakes.button({ user_id: user.id });

      return knex('users').insert(user)
        .then(() => knex('buttons').insert(button))
        .then(() => server.inject({
          url: `/buttons/${button.id}`
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.button');
          expect(res.result.button).to.have.all.keys([ 'id', 'name', 'type', 'userId' ]);
        });
    });

    xit('should 401 if not authorized'); // TODO: for when authentication is implemented
  });

  describe('GET /users/{userId}/buttons', () => {
    it("should list a user's buttons", () => {
      const users = _.times(2, fakes.user);
      const buttons = _.times(4, (i) => fakes.button({ user_id: users[i % 2].id }));

      return knex('users').insert(users)
        .then(() => knex('buttons').insert(buttons))
        .then(() => server.inject({
          url: `/users/${users[0].id}/buttons`
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.buttons.length', 2);
        });
    });

    it("should list a user's no buttons", () => {
      const users = _.times(3, fakes.user);
      const buttons = _.times(4, (i) => fakes.button({ user_id: users[i % 2].id }));

      return knex('users').insert(users)
        .then(() => knex('buttons').insert(buttons))
        .then(() => server.inject({
          url: `/users/${users[2].id}/buttons`
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.buttons.length', 0);
        });
    });
  });
});
